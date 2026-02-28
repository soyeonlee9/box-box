import { Resend } from 'resend';
import { supabase } from '../config/supabase';

const resend = new Resend(process.env.RESEND_API_KEY!);

export type NotificationType = 'system' | 'campaign_milestone' | 'badge_earned' | 'weekly_report';

export const sendInAppNotification = async (userId: string, brandId: string | null, type: NotificationType, title: string, message: string) => {
    try {
        const { error } = await supabase.from('notification_logs').insert({
            user_id: userId,
            brand_id: brandId,
            type,
            channel: 'in_app',
            title,
            message,
            is_read: false
        });
        if (error) throw error;
    } catch (error) {
        console.error('Error inserting in-app notification:', error);
    }
};

export const sendEmailNotification = async (targetEmail: string, subject: string, htmlContent: string) => {
    try {
        // Fallback to verified domain once user adds it, else use default resend for test mode
        const sender = 'no-reply@archetypestandard.com'; // User's upcoming verified domain!

        // However, if the domain is not yet verified in Resend, sending from it will fail in test mode.
        // We will send from archetypestandard.com but wrap it to not crash if fails
        const { error } = await resend.emails.send({
            from: `아키타이프 <${sender}>`,
            to: targetEmail,
            subject,
            html: htmlContent
        });

        if (error) {
            console.error('Resend delivery failed (Domain might not be verified yet):', error);
            // Re-attempt using onboarding@resend.dev to the owner email for early testing safety if needed
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'soyeon96120@gmail.com', // Safe fallback for dev testing
                subject: `[Dev Fallback] ${subject}`,
                html: htmlContent
            });
        }
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
};

/**
 * Orchestrates sending a notification based on user preferences in the DB.
 */
export const dispatchNotification = async (
    userId: string,
    brandId: string | null,
    type: NotificationType,
    title: string,
    message: string,
    htmlContent?: string
) => {
    try {
        // Fetch user preferences and email
        const { data: user, error } = await supabase
            .from('users')
            .select('email, notification_preferences')
            .eq('id', userId)
            .single();

        if (error || !user) throw new Error('User not found for notification dispatch');

        const prefs = user.notification_preferences || { email: true, inApp: true, weekly_report: true, campaign_milestone: true, badge_earned: true };

        // Check if user turned off this specific event type (e.g., campaign_milestone)
        if (prefs[type] === false) {
            console.log(`Notification of type ${type} skipped for user ${userId} due to specific event preference.`);
            return;
        }

        // 1. In-App Dispatch
        if (prefs.inApp) {
            await sendInAppNotification(userId, brandId, type, title, message);
        }

        // 2. Email Dispatch
        if (prefs.email && htmlContent && user.email) {
            await sendEmailNotification(user.email, title, htmlContent);
        }

    } catch (error) {
        console.error('Failed to dispatch notification:', error);
    }
};

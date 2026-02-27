"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter } from "next/navigation"
import { Building2, Plus, LogOut, ChevronRight, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"

interface Brand {
    id: string
    name: string
    manager_email: string
    created_at: string
}

export default function SuperAdminBrandsPage() {
    const router = useRouter()
    const { user, setSelectedBrandId, setSelectedBrandName, logout } = useAuthStore()
    const [brands, setBrands] = useState<Brand[]>([])
    const [loading, setLoading] = useState(true)

    const [createOpen, setCreateOpen] = useState(false)
    const [editBrand, setEditBrand] = useState<Brand | null>(null)

    const [formData, setFormData] = useState({ name: "", manager_email: "" })

    useEffect(() => {
        // 최고 관리자가 아니면 홈으로 리다이렉트
        if (!user) return;
        if (user.role !== 'super_admin') {
            toast.error("최고 관리자 권한이 필요합니다.")
            router.replace("/")
            return
        }

        // 포털에 들어오면 Impersonation 상태 초기화
        setSelectedBrandId(null)
        setSelectedBrandName(null)

        fetchBrands()
    }, [user, router, setSelectedBrandId, setSelectedBrandName])

    const fetchBrands = async () => {
        setLoading(true)
        try {
            const data = await apiFetch("/admin/brands")
            if (Array.isArray(data)) {
                setBrands(data)
            } else {
                console.error("Invalid response format:", data)
                setBrands([])
            }
        } catch (error) {
            console.error("Failed to fetch brands", error)
            toast.error("브랜드 목록을 불러오지 못했습니다.")
        } finally {
            setLoading(false)
        }
    }

    const handleCreateBrand = async () => {
        if (!formData.name || !formData.manager_email) {
            toast.error("브랜드명과 담당자 이메일을 입력해주세요.")
            return
        }
        try {
            await apiFetch("/admin/brands", {
                method: "POST",
                body: JSON.stringify(formData),
            })
            toast.success("브랜드가 성공적으로 등록되었습니다.")
            setCreateOpen(false)
            setFormData({ name: "", manager_email: "" })
            fetchBrands()
        } catch (error) {
            console.error("Create error", error)
            toast.error("브랜드 등록 중 오류가 발생했습니다.")
        }
    }

    const handleUpdateBrand = async () => {
        if (!editBrand || !formData.name || !formData.manager_email) return
        try {
            await apiFetch(`/admin/brands/${editBrand.id}`, {
                method: "PUT",
                body: JSON.stringify(formData),
            })
            toast.success("브랜드 정보가 수정되었습니다.")
            setEditBrand(null)
            fetchBrands()
        } catch (error) {
            console.error("Update error", error)
            toast.error("브랜드 수정 중 오류가 발생했습니다.")
        }
    }

    const handleDeleteBrand = async (id: string, name: string) => {
        if (!confirm(`정말 '${name}' 브랜드를 삭제하시겠습니까? (관련 데이터 모두 삭제됨)`)) return
        try {
            await apiFetch(`/admin/brands/${id}`, {
                method: "DELETE",
            })
            toast.success("브랜드가 삭제되었습니다.")
            fetchBrands()
        } catch (error) {
            console.error("Delete error", error)
            toast.error("브랜드 삭제 중 오류가 발생했습니다.")
        }
    }

    const openCreateModal = () => {
        setFormData({ name: "", manager_email: "" })
        setCreateOpen(true)
    }

    const openEditModal = (brand: Brand) => {
        setEditBrand(brand)
        setFormData({ name: brand.name, manager_email: brand.manager_email || "" })
    }

    const handleImpersonate = (brand: Brand) => {
        setSelectedBrandId(brand.id)
        setSelectedBrandName(brand.name)
        toast.success(`'${brand.name}' 대시보드로 접속합니다.`)
        router.push(`/?brandId=${brand.id}`)
    }

    const handleGoToMyDashboard = () => {
        setSelectedBrandId(null)
        setSelectedBrandName(null)
        toast.success("내 브랜드 대시보드로 이동합니다.")
        router.push("/")
    }

    const handleLogout = async () => {
        try {
            await apiFetch("/auth/logout", { method: "POST" }).catch(() => { });
        } finally {
            logout();
            router.push("/login");
        }
    }

    if (loading || !user || user.role !== 'super_admin') {
        return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">로딩 중이거나 권한을 확인 중입니다...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* 상단 네비게이션 바 */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                        <Building2 className="size-4 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-gray-900">
                        ARCHETYPE <span className="font-normal text-gray-500">Super Admin</span>
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600">
                        {user.name} 님
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-gray-900">
                        <LogOut className="mr-2 size-4" /> 로그아웃
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                {/* 헤더 */}
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">고객사(브랜드) 총괄 관리</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            아키타입 시스템에 등록된 전체 브랜드를 조회하고 관리합니다.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleGoToMyDashboard} className="flex gap-2">
                            <Building2 className="size-4" />
                            내 브랜드 대시보드 보기
                        </Button>
                        <Button onClick={openCreateModal} className="flex gap-2">
                            <Plus className="size-4" />
                            신규 브랜드 발급
                        </Button>
                    </div>
                </div>

                {/* 목록 테이블 */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="p-6">
                        <h3 className="font-semibold leading-none tracking-tight mb-4 flex gap-2 items-center">
                            <Building2 className="size-5 text-primary" />
                            브랜드 목록 <span className="text-muted-foreground font-normal text-sm ml-2">({brands.length}개)</span>
                        </h3>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>브랜드명</TableHead>
                                        <TableHead>담당자 이메일</TableHead>
                                        <TableHead>가입일자</TableHead>
                                        <TableHead className="w-[80px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {brands.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                등록된 브랜드가 없습니다.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        brands.map((b) => (
                                            <TableRow key={b.id}>
                                                <TableCell className="font-medium">{b.name}</TableCell>
                                                <TableCell>{b.manager_email || '-'}</TableCell>
                                                <TableCell>{new Date(b.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 text-primary border-primary/20 hover:bg-primary/10"
                                                            onClick={() => handleImpersonate(b)}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            대시보드 보기
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">메뉴 열기</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => openEditModal(b)}>
                                                                    <Pencil className="mr-2 h-4 w-4" /> 수정
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDeleteBrand(b.id, b.name)} className="text-destructive">
                                                                    <Trash2 className="mr-2 h-4 w-4" /> 삭제
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                {/* 신규 등록 모달 */}
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>신규 브랜드 등록</DialogTitle>
                            <DialogDescription>
                                아키타입 시스템을 이용할 새로운 고객사(브랜드)를 등록합니다.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    브랜드명
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-3"
                                    placeholder="예: 나이키 코리아"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    담당자 이메일
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.manager_email}
                                    onChange={(e) => setFormData({ ...formData, manager_email: e.target.value })}
                                    className="col-span-3"
                                    placeholder="담당자 연락처"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setCreateOpen(false)}>
                                취소
                            </Button>
                            <Button onClick={handleCreateBrand}>등록하기</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* 수정 모달 */}
                <Dialog open={!!editBrand} onOpenChange={(open) => !open && setEditBrand(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>브랜드 정보 수정</DialogTitle>
                            <DialogDescription>
                                브랜드의 이름이나 담당자 이메일을 변경합니다.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                    브랜드명
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-email" className="text-right">
                                    담당자 이메일
                                </Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={formData.manager_email}
                                    onChange={(e) => setFormData({ ...formData, manager_email: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditBrand(null)}>
                                취소
                            </Button>
                            <Button onClick={handleUpdateBrand}>저장하기</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    )
}

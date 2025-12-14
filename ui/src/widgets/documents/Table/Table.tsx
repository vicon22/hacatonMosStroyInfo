'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Text, Button, Icon, Card, Skeleton, Modal, Select, Spin, Label } from '@gravity-ui/uikit';
import { ArrowDownToSquare, FileText, Plus, ArrowUpFromSquare, TrashBin } from '@gravity-ui/icons';
import { memo } from 'react';
import { useAllProjects } from '@/entities/projects/hooks';

type DocumentStatus = 'NEW' | 'ON_REVIEW' | 'REVIEWED';

interface Document {
    id: string;
    fileName: string;
    originalFileName: string;
    contentType: string;
    fileSize: number;
    projectId: string;
    projectTitle: string;
    status: DocumentStatus;
    uploadedAt: string;
}

const STATUS_LABELS: Record<DocumentStatus, string> = {
    'NEW': 'новое',
    'ON_REVIEW': 'на проверке',
    'REVIEWED': 'проверено'
};

const STATUS_THEMES: Record<DocumentStatus, 'normal' | 'info' | 'success' | 'warning' | 'danger' | 'utility' | 'unknown' | 'clear'> = {
    'NEW': 'normal',
    'ON_REVIEW': 'warning',
    'REVIEWED': 'success'
};

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const DocumentsTable = memo(function DocumentsTable() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const projects = useAllProjects();

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await fetch('/api/docs', {
                credentials: 'include'
            });

            if (response.status === 401) {
                router.push('/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadDocument = async (id: string, fileName: string) => {
        try {
            const response = await fetch(`/api/docs/${id}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Failed to download document:', error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedProjectId) {
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch(`/api/projects/${selectedProjectId}/docs`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                setUploadModalOpen(false);
                setSelectedFile(null);
                setSelectedProjectId('');
                fetchDocuments();
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Failed to upload document:', error);
        } finally {
            setUploading(false);
        }
    };

    const openUploadModal = () => {
        setSelectedFile(null);
        setSelectedProjectId('');
        setUploadModalOpen(true);
    };

    const deleteDocument = async (id: string) => {
        if (!confirm('Вы уверены, что хотите удалить этот документ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/docs/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            console.log('[DELETE] Response status:', response.status);

            if (response.ok) {
                fetchDocuments();
            } else {
                const errorText = await response.text();
                console.error('Delete failed:', response.status, errorText);
                alert(`Не удалось удалить документ: ${errorText || response.status}`);
            }
        } catch (error) {
            console.error('Failed to delete document:', error);
            alert('Произошла ошибка при удалении документа');
        }
    };

    const sendToReview = async (id: string) => {
        try {
            const response = await fetch(`/api/docs/${id}/status`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'ON_REVIEW' })
            });

            if (response.ok) {
                fetchDocuments();
            } else {
                console.error('Status update failed');
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    if (loading) {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <Text variant='header-2'>
                        Мои документы
                    </Text>
                </div>
                <Skeleton style={{ height: '400px' }} />
            </div>
        );
    }

    const projectOptions = projects.data?.map(p => ({
        value: p.id,
        content: p.title
    })) || [];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Text variant='header-2'>
                    Мои документы
                </Text>
                <Button
                    view='action'
                    size='l'
                    onClick={openUploadModal}
                >
                    <Icon data={Plus} />
                    Загрузить документ
                </Button>
            </div>

            {documents.length === 0 ? (
                <Card view='outlined' style={{ padding: '48px', textAlign: 'center' }}>
                    <Icon data={FileText} size={48} style={{ marginBottom: '24px', opacity: 0.3 }} />
                    <Text variant='body-2' color='secondary' style={{ marginBottom: '32px', display: 'block' }}>
                        У вас пока нет загруженных документов
                    </Text>
                    <Button
                        view='outlined'
                        size='l'
                        onClick={openUploadModal}
                    >
                        <Icon data={Plus} />
                        Загрузить первый документ
                    </Button>
                </Card>
            ) : (
                <Table
                    columns={[
                        {
                            id: 'name',
                            name: 'Название',
                            template: (item: Document) => (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Icon data={FileText} size={16} />
                                    <Text variant='body-1'>{item.originalFileName}</Text>
                                </div>
                            )
                        },
                        {
                            id: 'project',
                            name: 'Проект',
                            template: (item: Document) => (
                                <Text variant='body-1'>
                                    {item.projectTitle}
                                </Text>
                            )
                        },
                        {
                            id: 'status',
                            name: 'Статус',
                            template: (item: Document) => (
                                <Label theme={STATUS_THEMES[item.status]}>
                                    {STATUS_LABELS[item.status]}
                                </Label>
                            )
                        },
                        {
                            id: 'size',
                            name: 'Размер',
                            template: (item: Document) => (
                                <Text variant='body-1' color='secondary'>
                                    {formatFileSize(item.fileSize)}
                                </Text>
                            )
                        },
                        {
                            id: 'date',
                            name: 'Дата загрузки',
                            template: (item: Document) => (
                                <Text variant='body-1' color='secondary' suppressHydrationWarning>
                                    {formatDate(item.uploadedAt)}
                                </Text>
                            )
                        },
                        {
                            id: 'actions',
                            name: '',
                            template: (item: Document) => (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {item.status === 'NEW' && (
                                        <Button
                                            view='outlined'
                                            size='m'
                                            onClick={() => sendToReview(item.id)}
                                        >
                                            <Icon data={ArrowUpFromSquare} size={16} />
                                            На проверку
                                        </Button>
                                    )}
                                    <Button
                                        view='outlined'
                                        size='m'
                                        onClick={() => downloadDocument(item.id, item.originalFileName)}
                                    >
                                        <Icon data={ArrowDownToSquare} size={16} />
                                        Скачать
                                    </Button>
                                    <Button
                                        view='outlined-danger'
                                        size='m'
                                        onClick={() => deleteDocument(item.id)}
                                    >
                                        <Icon data={TrashBin} size={16} />
                                    </Button>
                                </div>
                            )
                        }
                    ]}
                    data={documents}
                />
            )}

            <Modal
                open={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
            >
                <div style={{ padding: '24px', minWidth: '400px' }}>
                    <Text variant='header-1' style={{ marginBottom: '24px' }}>
                        Загрузить документ
                    </Text>

                    <div style={{ marginBottom: '20px' }}>
                        <Text variant='body-2' style={{ marginBottom: '8px', display: 'block' }}>
                            Выберите проект
                        </Text>
                        <Select
                            size='xl'
                            width='max'
                            placeholder='Выберите проект'
                            value={selectedProjectId ? [selectedProjectId] : []}
                            onUpdate={(value) => setSelectedProjectId(value[0])}
                            options={projectOptions}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <Text variant='body-2' style={{ marginBottom: '8px', display: 'block' }}>
                            Выберите файл
                        </Text>
                        <input
                            ref={fileInputRef}
                            type='file'
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Button
                                view='outlined'
                                size='xl'
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Icon data={ArrowUpFromSquare} />
                                Выбрать файл
                            </Button>
                            {selectedFile && (
                                <Text variant='body-1' color='secondary'>
                                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                                </Text>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <Button
                            view='flat'
                            size='xl'
                            onClick={() => setUploadModalOpen(false)}
                            disabled={uploading}
                        >
                            Отмена
                        </Button>
                        <Button
                            view='action'
                            size='xl'
                            onClick={handleUpload}
                            disabled={!selectedFile || !selectedProjectId || uploading}
                        >
                            {uploading ? <Spin size='xs' /> : <Icon data={Plus} />}
                            {uploading ? 'Загрузка...' : 'Загрузить'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
});

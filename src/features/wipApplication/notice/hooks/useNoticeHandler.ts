import { useState } from 'react';
import { useNoticeStore, Content } from '@/features/wipApplication/notice/store/useNoticeStore';

export const useNoticeHandler = () => {
  // 훅 내부에서 state 생성
  const [open, setOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    mustRead?: number;
  }>({
    title: '',
    description: '',
    mustRead: 0,
  });

  // Zustand store에서 액션 가져오기
  const { addContent, updateContent, deleteContent } = useNoticeStore();

  const handleOpen = (content?: Content) => {
    if (content) {
      setEditingContent(content);
      setFormData({
        title: content.title,
        description: content.description,
        mustRead: content.mustRead || 0,
      });
    } else {
      setEditingContent(null);
      setFormData({
        title: '',
        description: '',
        mustRead: 0,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingContent(null);
    setFormData({
      title: '',
      description: '',
      mustRead: 0,
    });
  };

  const handleSave = async () => {
    console.log('formData', formData);
    setLoading(true);

    try {
      if (editingContent) {
        // 수정 모드 - PUT API 호출
        const response = await fetch(`/api/notices/${editingContent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mustRead: formData.mustRead || 0,
            title: formData.title,
            contents: formData.description,
          }),
        });

        const data = await response.json();
        console.log('PUT 응답 전체:', data);
        console.log('data.error 값:', data.error);

        // HTTP 상태 코드로 성공/실패 판단
        if (!response.ok) {
          console.error('공지사항 수정 실패:', data);
          alert(`공지사항 수정에 실패했습니다: ${data.error || data.message || '알 수 없는 오류'}`);
          return;
        }

        console.log('공지사항 수정 성공:', data);

        // 성공 시 로컬 상태도 업데이트
        updateContent(editingContent.id, formData);

        handleClose();
      } else {
        // 새 콘텐츠 추가 - POST API 호출
        const response = await fetch('/api/notices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mustRead: formData.mustRead || 0,
            title: formData.title,
            contents: formData.description, // description을 contents로 매핑
          }),
        });

        const data = await response.json();
        console.log('POST 응답 전체:', data);
        console.log('data.error 값:', data.error);

        // HTTP 상태 코드로 성공/실패 판단
        if (!response.ok) {
          console.error('공지사항 생성 실패:', data);
          alert(`공지사항 생성에 실패했습니다: ${data.error || data.message || '알 수 없는 오류'}`);
          return;
        }

        console.log('공지사항 생성 성공:', data);

        // 성공 시 로컬 상태도 업데이트
        addContent({
          ...formData,
          createdAt: new Date().toISOString().split('T')[0],
          views: 0,
          mustRead: formData.mustRead || 0,
        });

        handleClose();
      }
    } catch (error) {
      console.error('API 호출 실패:', error);
      alert('작업에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('DELETE 응답 전체:', data);
      console.log('data.error 값:', data.error);

      // HTTP 상태 코드로 성공/실패 판단
      if (!response.ok) {
        console.error('공지사항 삭제 실패:', data);
        alert(`공지사항 삭제에 실패했습니다: ${data.error || data.message || '알 수 없는 오류'}`);
        return;
      }

      console.log('공지사항 삭제 성공:', data);

      // 성공 시 로컬 상태도 업데이트
      deleteContent(id);
    } catch (error) {
      console.error('API 호출 실패:', error);
      alert('공지사항 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // state와 handler 모두 반환
  return {
    open,
    editingContent,
    formData,
    setFormData,
    loading,
    handleOpen,
    handleClose,
    handleSave,
    handleDelete,
  };
};

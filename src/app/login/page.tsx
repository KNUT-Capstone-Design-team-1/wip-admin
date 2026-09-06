'use client';

/**
 * 로그인 페이지
 *
 * 기능:
 * 1. 아이디/비밀번호 입력
 * 2. 비밀번호 보기/숨기기 토글
 * 3. 에러 메시지 표시
 * 4. 로딩 상태 표시
 * 5. Enter 키로 로그인
 * 6. Rate Limit 초과 시 재시도 시간 표시
 */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { encryptLoginPayload } from '@/lib/loginCrypto.client';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

export default function LoginPage() {
  const router = useRouter();

  // ==================================================
  // 상태 관리
  // ==================================================

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ==================================================
  // 이벤트 핸들러
  // ==================================================

  /**
   * 로그인 폼 제출
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 입력 검증
    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // 페이로드를 공개키(RSA-OAEP)로 암호화 + timestamp 포함
      // → 네트워크/프록시 로그에 평문 노출 방지 + replay attack 차단
      const payload = await encryptLoginPayload({ username, password });

      // 로그인 API 호출
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload }),
      });

      const data = await response.json();

      if (response.ok) {
        // 로그인 성공
        console.log('✅ 로그인 성공');

        // 메인 페이지로 이동
        router.push('/wipApplication');
        router.refresh(); // 서버 컴포넌트 새로고침
      } else {
        // 로그인 실패
        setError(data.error || '로그인에 실패했습니다.');

        // Rate Limit 초과 시 비밀번호 필드 비우기
        if (response.status === 429) {
          setPassword('');
        }
      }
    } catch (error) {
      console.error('❌ 로그인 오류:', error);
      setError('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 비밀번호 보기/숨기기 토글
   */
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Enter 키 처리
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e as unknown as FormEvent);
    }
  };

  // ==================================================
  // 렌더링
  // ==================================================

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Card
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          {/* 헤더 */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                mb: 2,
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
              }}
            >
              <AdminIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              관리자 로그인
            </Typography>

            <Typography variant="body2" color="text.secondary">
              관리자 계정으로 로그인하세요
            </Typography>
          </Box>

          {/* 에러 메시지 */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* 로그인 폼 */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* 아이디 입력 */}
            <TextField
              fullWidth
              label="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoComplete="username"
              autoFocus
              sx={{ mb: 2 }}
              placeholder="관리자 아이디를 입력하세요"
            />

            {/* 비밀번호 입력 */}
            <TextField
              fullWidth
              label="비밀번호"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoComplete="current-password"
              placeholder="비밀번호를 입력하세요"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                      aria-label="비밀번호 표시 토글"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {/* 로그인 버튼 */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5558e3 0%, #7c4de0 100%)',
                  boxShadow: '0 6px 16px rgba(99, 102, 241, 0.5)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                },
              }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </Box>

          {/* 안내 메시지 */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              관리자 계정이 필요합니다
            </Typography>
          </Box>
        </Card>

        {/* 푸터 */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            보안을 위해 비밀번호를 주기적으로 변경하세요
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

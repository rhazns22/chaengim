import axios from 'axios';

export function normalizeErrorMessage(error: unknown): string {
  if (import.meta.env.DEV) {
    console.debug('[Error Debug]', error);
  }

  // 1. Axios Error
  if (axios.isAxiosError(error)) {
    // 백엔드에서 명시적으로 내려준 에러 메시지가 있는 경우
    const serverMessage = error.response?.data?.error;
    if (typeof serverMessage === 'string' && serverMessage.trim() !== '') {
      return serverMessage;
    }
    
    // 백엔드가 JSON 형태로 { message: ... } 를 내려준 경우
    if (serverMessage && typeof serverMessage === 'object' && serverMessage.message) {
      return serverMessage.message;
    }

    // 서버가 응답하지 않는 네트워크 레벨 에러
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      return '서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.';
    }

    // HTTP 상태 코드 기반 매칭
    const status = error.response?.status;
    switch (status) {
      case 401:
        return '다시 로그인해주세요.';
      case 403:
        return '접근 권한이 없어요.';
      case 404:
        return '요청한 정보를 찾을 수 없어요.';
      case 500:
      case 502:
      case 503:
      case 504:
        return '서버에 문제가 발생했어요. 잠시 후 다시 시도해주세요.';
    }
    
    return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }

  // 2. 일반 Error 객체
  if (error instanceof Error) {
    if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
      return '서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.';
    }
    // 프론트엔드 자체 발생 일반 에러는 굳이 노출하지 않고 포괄적 메시지로 치환
    return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }

  // 3. String (직접 throw 한 문자열 등)
  if (typeof error === 'string' && error.trim() !== '') {
    return error;
  }

  // 4. Object 중 message가 있는 형태 최후 검사
  if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
    return (error as any).message;
  }

  // 5. 알 수 없는 에러
  return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

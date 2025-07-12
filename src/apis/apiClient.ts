// src/apis/apiClient.ts
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000,
});

// 1) 요청 인터셉터: 토큰 자동 첨부
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ACCESS_TOKEN")
        : null;
    if (token) {
      config.headers!["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2) 응답 인터셉터: 401 감지 → URL 체크 후 리프레시
apiClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // 401 이면서, 원래 요청 URL이 리프레시 엔드포인트가 아닐 때만 처리
    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/auth/refresh"
    ) {
      try {
        // raw axios로만 호출 → 이 호출엔 interceptor가 걸리지 않음
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
          { refreshToken: localStorage.getItem("REFRESH_TOKEN") }
        );
        localStorage.setItem("ACCESS_TOKEN", data.accessToken);

        // 갱신된 토큰으로 헤더 재설정 후 원래 요청 재실행
        originalRequest.headers![
          "Authorization"
        ] = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (_err) {
        // 리프레시 실패 시 로그아웃 처리
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(_err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

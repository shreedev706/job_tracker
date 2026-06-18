import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../features/user/userSlice";
import {getUser } from "../http/http";

interface LoadingRefreshResult {
  loading: boolean;
}

export const useLoadingWithRefresh = (): LoadingRefreshResult => {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const refreshSession = async () => {
      try {
        const { data } = await getUser();
        if (isMounted) {
          dispatch(setAuth(data));
        }
      } catch (error) {
        console.error("Session refresh validation failed:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    refreshSession();

    // The cleanup function is returned here, not from the async block
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return { loading };
};
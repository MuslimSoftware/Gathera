import { useState } from 'react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { ReportReason } from '../../../gathera-lib/enums/report';

export const useReportUser = (userId: string, onSendReportSuccess: () => void) => {
    const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
    const [description, setDescription] = useState<string>('');
    const { isLoading, error, fetchAsync } = useFetch();

    const reportUser = async () => {
        await fetchAsync({ url: `/user/report/${userId}`, method: 'POST', body: { reason: selectedReason, description } }, onSendReportSuccess);
    };

    return {
        isLoading,
        error,
        reportUser,
        selectedReason,
        setSelectedReason,
        description,
        setDescription,
    };
};

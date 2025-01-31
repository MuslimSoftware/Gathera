import { normalizeRequestConfig, getResponse } from '../../../shared/utils/fetchHookUtils';

// TODO: use useFetch instead
export const upsertDetail = async (detail: string, value: string | Array<string>, accessToken: string) => {
    const valueFormatted = typeof value === 'string' ? value.toLowerCase() : value;
    const config = normalizeRequestConfig(
        {
            url: `/user/details/upsert`,
            method: 'POST',
            body: { updateFields: { [detail]: valueFormatted } },
        },
        true,
        accessToken
    );

    const data = await getResponse(config);
    return data;
};

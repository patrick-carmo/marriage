const user = {
  id: 1,
  email: 'string',
  name: 'string',
  picture: 'Google Picture URL',
};

const createListResponse = (key: string) => {
  const response = {
    [key]: [
      {
        id: 1,
        [`${key}_id`]: `Google drive ${key} ID`,
        content: 'string',
        created_at: 'Date',
        user,
      },
    ],
    total: 1,
    page: 1,
    limit: 10,
    pages: 1,
  };

  if (key === 'comment') delete response[key][0][`${key}_id`];
  if (key === 'video') delete response[key][0].content;

  return response;
};

export const PhotoListResponse = createListResponse('photo');
export const VideoListResponse = createListResponse('video');
export const CommentListResponse = createListResponse('comment');

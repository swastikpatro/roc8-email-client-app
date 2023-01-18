interface singleEmailType {
  id: string;
  date: string;
  from: { email: string; name: string };
  isFavorite: boolean;
  isRead: boolean;
  short_description: string;
  subject: string;
}

interface contextType {
  data: singleEmailType[];
  displayableList: singleEmailType[];
  emailListLoading: boolean;
  emailListError: boolean;
  activeEmailId: string;
  activeFilter: string;
  paginatedIndex: number;
  filterAndDisplay: (filterType: string) => void;
  showBodyMakeItReadAndActive: (id: string) => void;
  removeEmailBodyFromScreen: () => void;
  toggleFavoriteAndRerenderUpdatedList: (id: string) => void;
  setPaginateButtonActive: (buttonNo: number) => void;
}

export type { contextType, singleEmailType };

import { createContext, useContext, useEffect, useReducer } from 'react';
import getDateFormat from './getDateFormat';
import { contextType, singleEmailType } from './types';
const URL = 'https://flipkart-email-mock.now.sh/';
export const ITEMS_PERPAGE = 10;

const AppContext = createContext<contextType>(null!);
const useAppContext = () => {
  return useContext(AppContext);
};

// interface actionType {
//   type: string;
//   payloadData: singleEmailType[];
//   payloadFilterName: string;
//   payloadBtnIndex: number;
//   payloadFavEmailId: string;
//   payloadActiveEmailId: string;
// }

// interface stateType {
//   activeFilter: string;
//   activeEmailId: string | null;
//   data: singleEmailType[] | never[];
//   emailListLoading: boolean;
//   displayableList: singleEmailType[] | never[];
//   paginatedIndex: number;
// }

const initialState = {
  activeFilter: 'all',
  activeEmailId: null,
  data: [],
  emailListLoading: true,
  emailListError: false,
  displayableList: [],
  paginatedIndex: 0,
};

const filteredListProvidedType = (
  dataList: singleEmailType[],
  type: string
) => {
  if (type === 'all') {
    return dataList;
  } else if (type === 'unread') {
    return dataList.filter((singleEmail) => !singleEmail.isRead);
  } else if (type === 'read') {
    return dataList.filter((singleEmail) => singleEmail.isRead);
  } else if (type === 'favorites') {
    return dataList.filter((singleEmail) => singleEmail.isFavorite);
  }
};

// const tpData = [
//   { id: 1 },
//   { id: 2 },
//   { id: 3 },
//   { id: 4 },
//   { id: 5 },
//   { id: 6 }
// ];

// console.log(getPaginatedData(tpData, 3));

// @ts-ignore
const appReducer = (state, action) => {
  switch (action.type) {
    case 'STOP_LOADING_DISPLAY_DATA':
      return {
        ...state,
        data: action.payloadData,
        emailListLoading: false,
        emailListError: false,
        displayableList: action.payloadData,
      };
    case 'STOP_LOADING_SHOW_ERROR':
      return {
        ...state,
        emailListLoading: false,
        emailListError: true,
      };

    case 'SET_FILTER_AND_DISPLAY':
      const filteredList = filteredListProvidedType(
        state.data,
        action.payloadFilterName
      );

      const indexOfActiveEmail =
        filteredList?.findIndex(
          (singleEmail) => singleEmail.id === state.activeEmailId
        ) ?? -1;

      // console.log({
      //   indexOfActiveEmail,
      //   pageNo: Math.floor(indexOfActiveEmail / ITEMS_PERPAGE)
      // });

      return {
        ...state,
        activeFilter: action.payloadFilterName,
        paginatedIndex:
          indexOfActiveEmail !== -1
            ? Math.floor(indexOfActiveEmail / ITEMS_PERPAGE)
            : 0,
        displayableList: filteredListProvidedType(
          state.data,
          action.payloadFilterName
        ),
      };

    case 'SHOW-BODY_SET-ACTIVE-EMAIL-RERENDER-WITH-UPDATED-READ':
      // @ts-ignore
      const updatedListWithRead = state.data.map((singleEmail) => {
        if (singleEmail.id === action.payloadActiveEmailId) {
          return { ...singleEmail, isRead: true };
        } else {
          return singleEmail;
        }
      });

      const filteredUpdatedListWithRead = filteredListProvidedType(
        updatedListWithRead,
        state.activeFilter
      );

      const isPagePaginatingOnUpdatingRead =
        filteredUpdatedListWithRead &&
        filteredUpdatedListWithRead.length !== 0 &&
        filteredUpdatedListWithRead.length % ITEMS_PERPAGE === 0;

      // console.log({
      //   displayList: state.displayableList,
      //   filteredUpdatedListWithRead
      // });

      return {
        ...state,
        activeEmailId: action.payloadActiveEmailId,
        data: updatedListWithRead,
        displayableList: filteredUpdatedListWithRead,
        paginatedIndex: isPagePaginatingOnUpdatingRead
          ? state.paginatedIndex - 1 < 0
            ? 0
            : state.paginatedIndex - 1
          : state.paginatedIndex,
      };

    case 'TOGGLE-FAVORITE-FOR-EMAIL-PROVIDED_RERENDER-WITH-UPDATED-READ':
      // @ts-ignore
      const updatedListWithFavorite = state.data.map((singleEmail) => {
        if (singleEmail.id === action.payloadFavEmailId) {
          return { ...singleEmail, isFavorite: !singleEmail.isFavorite };
        } else {
          return singleEmail;
        }
      });

      const filteredUpdatedListWithFavorite = filteredListProvidedType(
        updatedListWithFavorite,
        state.activeFilter
      );

      const isPagePaginatingOnUpdatingFav =
        filteredUpdatedListWithFavorite &&
        filteredUpdatedListWithFavorite.length !== 0 &&
        filteredUpdatedListWithFavorite.length % 10 === 0;

      return {
        ...state,
        data: updatedListWithFavorite,
        displayableList: filteredUpdatedListWithFavorite,
        paginatedIndex: isPagePaginatingOnUpdatingFav
          ? state.paginatedIndex - 1 < 0
            ? 0
            : state.paginatedIndex - 1
          : state.paginatedIndex,
      };

    case 'REMOVE_EMAIL_BODY':
      return {
        ...state,
        activeEmailId: null,
      };

    case 'SET_PAGINATE_INDEX':
      return {
        ...state,
        paginatedIndex: action.payloadBtnIndex,
      };

    default:
      throw new Error(
        `Action '${action.type}' Type does not match with any case`
      );
  }
};

const AppContextProvider = ({ children }: { children: JSX.Element }) => {
  // @ts-ignore
  const storedState = JSON.parse(sessionStorage.getItem('outlook_app_state'));

  // console.log({ storedState });

  const [state, dispatch] = useReducer(appReducer, storedState || initialState);

  useEffect(() => {
    sessionStorage.setItem('outlook_app_state', JSON.stringify(state));
  }, [state]);

  const fetchData = async (URL: string) => {
    try {
      const res = await fetch(URL);
      if (!res.ok || !res) {
        throw new Error("Can't fetch email list.");
      }
      const { list } = await res.json();

      // @ts-ignore
      const updatedList: singleEmailType[] = list.map((singleItem) => {
        return {
          ...singleItem,
          date: getDateFormat(singleItem.date),
          isRead: false,
          isFavorite: false,
        };
      });
      // console.log(updatedList);

      dispatch({
        type: 'STOP_LOADING_DISPLAY_DATA',
        payloadData: updatedList,
      });
    } catch (err) {
      dispatch({
        type: 'STOP_LOADING_SHOW_ERROR',
      });
      console.log(err);
    }
  };

  useEffect(() => {
    if (!storedState) {
      fetchData(URL);
    }
  }, []);

  // console.log({ state });
  const filterAndDisplay = (filterType: string) => {
    dispatch({ type: 'SET_FILTER_AND_DISPLAY', payloadFilterName: filterType });
  };

  const showBodyMakeItReadAndActive = (id: string) => {
    dispatch({
      type: 'SHOW-BODY_SET-ACTIVE-EMAIL-RERENDER-WITH-UPDATED-READ',
      payloadActiveEmailId: id,
    });
  };

  const removeEmailBodyFromScreen = () => {
    dispatch({ type: 'REMOVE_EMAIL_BODY' });
  };

  const toggleFavoriteAndRerenderUpdatedList = (id: string) => {
    dispatch({
      type: 'TOGGLE-FAVORITE-FOR-EMAIL-PROVIDED_RERENDER-WITH-UPDATED-READ',
      payloadFavEmailId: id,
    });
  };

  const setPaginateButtonActive = (buttonNo: number) => {
    dispatch({ type: 'SET_PAGINATE_INDEX', payloadBtnIndex: buttonNo });
  };

  const contextValue = {
    data: state?.data,
    displayableList: state?.displayableList,
    emailListLoading: state?.emailListLoading,
    emailListError: state?.emailListError,
    activeEmailId: state?.activeEmailId,
    activeFilter: state?.activeFilter,
    paginatedIndex: state?.paginatedIndex,
    filterAndDisplay,
    showBodyMakeItReadAndActive,
    removeEmailBodyFromScreen,
    toggleFavoriteAndRerenderUpdatedList,
    setPaginateButtonActive,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export { useAppContext, AppContextProvider };

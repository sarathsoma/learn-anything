import actions from 'constants/actions.json';


const initialState = {
  menu: true,
  breadcrumbs: true,
  searchbar: false,
};


export default (state = initialState, action) => {
  switch (action.type) {
    case actions.header.showSearchbar:
      return {
        menu: true,
        breadcrumbs: false,
        searchbar: true,
      };

    case actions.header.hideSearchbar:
      return {
        menu: true,
        breadcrumbs: false,
        searchbar: false,
      };

    default:
      return state;
  }
};

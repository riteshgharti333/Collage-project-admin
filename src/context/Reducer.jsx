const Reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };

    case "LOGIN_SUCCESS":
      // ✅ Store user in localStorage immediately after login
      localStorage.setItem("user", JSON.stringify(action.payload));

      return {
        ...state,
        user: action.payload,
        isFetching: false,
        error: false,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isFetching: false,
        error: true,
      };

    case "UPDATE_START":
      return {
        ...state,
        isFetching: true,
      };

    case "UPDATE_SUCCESS":
      // ✅ Automatically update `localStorage` with the new user data
      localStorage.setItem("user", JSON.stringify(action.payload));

      return {
        ...state,
        user: action.payload,  // Update the context state
        isFetching: false,
        error: false,
      };

    case "UPDATE_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };

    case "LOGOUT":
      // ✅ Remove user from `localStorage` on logout
      localStorage.removeItem("user");

      return {
        ...state,
        user: null,
        isFetching: false,
        error: false,
      };

    default:
      return state;
  }
};

export default Reducer;

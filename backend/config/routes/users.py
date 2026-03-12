class UsersRoutes:
    APP_NAME = "users"

    REGISTER_PATH = "register/"
    LOGIN_PATH = "login/"
    REFRESH_PATH = "refresh/"
    ME_PATH = "me/"

    REGISTER_NAME = "register"
    LOGIN_NAME = "login"
    REFRESH_NAME = "token_refresh"
    ME_NAME = "me"

    REGISTER_FULL_NAME = f"{APP_NAME}:{REGISTER_NAME}"
    LOGIN_FULL_NAME = f"{APP_NAME}:{LOGIN_NAME}"
    REFRESH_FULL_NAME = f"{APP_NAME}:{REFRESH_NAME}"
    ME_FULL_NAME = f"{APP_NAME}:{ME_NAME}"
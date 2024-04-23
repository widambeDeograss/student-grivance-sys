import { baseUrl } from "./baseUrl";

export const authUrls = {
    login : baseUrl + "/api/auth/login",
    register : baseUrl + "/api/auth/register",
    rolesChange : baseUrl + "/api/auth/change-role",
}

export const usersInfo = { 
    allUsers : baseUrl + "/api/auth/user-information",
    userInfo: baseUrl + "/api/auth/current_loogged_user"
}
export const problemsUrl = { 
    allProblemsTypes : baseUrl + "/api/problem_type",
}

export const DivisionUrls = { 
    allDivisions : baseUrl + "/api/divisions",
    subDivision : baseUrl + "/api/sub_divisions",
    divProblemType : baseUrl + "/api/problem_type"
}
export const grivancesUrls = { 
    allBrivance : baseUrl + "/api/divisions",
    grivanceInfo : baseUrl + "/api/sub_divisions",
    submitGrivance : baseUrl + "/api/submit_grivence"
}
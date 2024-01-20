import { atom } from "nanostores";
import axios from "./api/axios";
import { readCookie, deleteCookie } from "./util/cookies";

export const isLoggedIn = atom(false)
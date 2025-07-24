import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ko: {
    translation: {
      tabs: {
        home: "홈",
        search: "검색",
        add: "추가",
        notifications: "알림",
        profile: "프로필",
      },
      page: "페이지",
      here_is: "여기는 {{tab}} 탭의 내용입니다.",
      logo: "god난아기",
    },
  },
  en: {
    translation: {
      tabs: {
        home: "Home",
        search: "Search",
        add: "Add",
        notifications: "Notifications",
        profile: "Profile",
      },
      page: "Page",
      here_is: "This is the {{tab}} tab.",
      logo: "Imthegod, the baby",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ko",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

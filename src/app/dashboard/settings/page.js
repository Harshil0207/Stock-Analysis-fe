import SettingsPage from "../../../imports/Settings/ui/pages/SettingsPage.js";

export const metadata = {
  title: "Settings - TRADESET Terminal",
  description: "Configure operator profiles, vault security credentials, and Finnhub stock API options."
};

export default function Page() {
  return <SettingsPage />;
}

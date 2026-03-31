import { RouterProvider } from "react-router-dom";

import { ReadingPreferencesProvider } from "./contexts/ReadingPreferencesContext";
import { router } from "./app/router";

function App() {
  return (
    <ReadingPreferencesProvider>
      <RouterProvider router={router} />
    </ReadingPreferencesProvider>
  );
}

export default App;

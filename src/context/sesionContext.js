// Solo crea el "contexto" de la sesión (quién inició sesión).
// Quien lo llena es SesionProvider; quien lo lee es el hook useSesion.
import { createContext } from "react";

export const SesionContext = createContext(null);

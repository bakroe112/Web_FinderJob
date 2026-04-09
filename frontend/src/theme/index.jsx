import { createTheme } from "@mui/material";
import { Palette } from "./elements/palette";
import { primaryFont, typography } from "./elements/typography";
import { Shadows } from "./elements/shadow";
import ComponentsCustom from "./elements/components";

export function MuiTheme() {
  const palette = Palette();
  const shadows = Shadows(palette);

  return createTheme({
    palette,
    typography,
    fontFamily: primaryFont,
    shadows: shadows.main,
    components: ComponentsCustom(shadows, palette, typography),
  });
}

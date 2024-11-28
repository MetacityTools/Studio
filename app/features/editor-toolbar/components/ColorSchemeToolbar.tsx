import {
  ActionGroup,
  Item,
  Tooltip,
  TooltipTrigger,
  useProvider,
  View,
} from "@adobe/react-spectrum";
import useColorScheme from "@core/hooks/useColorScheme";
import { MdiMoonWaningCrecnet } from "@core/icons/MdiMoonWaningCrecnet";
import { MdiWhiteBalanceSunny } from "@core/icons/MdiWhiteBalanceSunny";
import { useCallback } from "react";

export default function ColorSchemeToolbar() {
  const { colorScheme } = useProvider();
  const setColorScheme = useColorScheme();

  const handleToggleScheme = useCallback(() => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  }, [colorScheme, setColorScheme]);

  return (
    <View
      backgroundColor="gray-50"
      padding="size-50"
      borderRadius="medium"
      borderColor="gray-300"
      borderWidth="thin"
      gridArea="scheme"
    >
      <ActionGroup
        overflowMode="collapse"
        onAction={handleToggleScheme}
        isQuiet
      >
        <TooltipTrigger delay={0} placement="bottom">
          <Item key="toggleScheme">
            {colorScheme === "dark" ? (
              <MdiWhiteBalanceSunny />
            ) : (
              <MdiMoonWaningCrecnet />
            )}
          </Item>
          <Tooltip>
            {colorScheme === "dark"
              ? "Switch to light theme"
              : "Switch to dark theme"}
          </Tooltip>
        </TooltipTrigger>
      </ActionGroup>
    </View>
  );
}

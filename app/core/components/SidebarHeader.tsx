import { Flex, Heading, View } from "@adobe/react-spectrum";
import { ReactNode } from "react";

type SidebarHeaderProps = {
  title: string;
  children?: ReactNode;
};

export default function SidebarHeader({ children, title }: SidebarHeaderProps) {
  return (
    <View position="relative" overflow="hidden" marginX="size-200">
      <Flex direction="row" width="100%" alignItems="center" justifyContent="space-between" gap="size-100">
        <Heading level={4} marginY="size-200">
          {title}
        </Heading>
        {children}
      </Flex>
    </View>
  );
}

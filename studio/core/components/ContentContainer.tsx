import { Flex } from "@adobe/react-spectrum";

type ContentContainerProps = {
  children: React.ReactNode;
};

export const ContentContainer = ({ children }: ContentContainerProps) => {
  return (
    <Flex
      direction="column"
      width="100%"
      height="100%"
      gap="size-100"
      justifyContent="start"
      alignItems="start"
      marginX="size-200"
      marginY="size-200"
    >
      {children}
    </Flex>
  );
};

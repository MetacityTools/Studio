import { Flex, View } from "@adobe/react-spectrum";
import { useUser } from "@core/hooks/useUser";

type HeaderProps = {
  children?: React.ReactNode;
};

export default function Header(props: HeaderProps) {
  const { children } = props;
  const user = useUser();

  return (
    <View
      borderBottomWidth="thin"
      borderBottomColor="light"
      borderRadius="xsmall"
      padding="size-10"
      width="100%"
      paddingY="size-100"
      backgroundColor="gray-50"
    >
      <Flex direction="row" width="100%" gap="size-10" justifyContent="start" alignItems="center">
        {children}
      </Flex>
    </View>
  );
}

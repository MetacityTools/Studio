import { Avatar, Breadcrumbs, Flex, Item, View } from "@adobe/react-spectrum";
import { useUser } from "@core/hooks/useUser";

type BreadcrumbItem = {
  key: string;
  children: string;
  link?: string;
};

type HeaderProps = {
  nav: BreadcrumbItem[];
  children?: React.ReactNode;
};

export default function Header(props: HeaderProps) {
  const { nav, children } = props;
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
      <Flex
        direction="row"
        width="100%"
        gap="size-10"
        justifyContent="space-between"
        alignItems="center"
      >
        <Breadcrumbs marginX="size-100" flex="1">
          {nav.map((item) => (
            <Item key={item.key} href={item.link}>
              {item.children}
            </Item>
          ))}
        </Breadcrumbs>
        {children}
        {user?.picture && (
          <Avatar
            src={user?.picture}
            alt="default Adobe avatar"
            marginX="size-100"
            size="avatar-size-500"
          />
        )}
      </Flex>
    </View>
  );
}

import { Content, Heading, IllustratedMessage } from "@adobe/react-spectrum";
import NotFound from "@spectrum-icons/illustrations/NotFound";

export const NoData = () => {
  return (
    <IllustratedMessage>
      <NotFound />
      <Heading>No Data</Heading>
      <Content>Nothing to find here</Content>
    </IllustratedMessage>
  );
};

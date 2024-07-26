import { Content, Heading, IllustratedMessage } from "@adobe/react-spectrum";
import NotFound from "@spectrum-icons/illustrations/NotFound";

type EmptyProps = {
  heading?: string;
  content?: string;
};

export const NoData = (props: EmptyProps) => {
  const { heading = "No Data", content = "Nothing to find here" } = props;
  return (
    <IllustratedMessage>
      <NotFound />
      <Heading>{heading}</Heading>
      <Content>{content}</Content>
    </IllustratedMessage>
  );
};

export const Loading = () => {
  return (
    <IllustratedMessage>
      <Content>Loading...</Content>
    </IllustratedMessage>
  );
};

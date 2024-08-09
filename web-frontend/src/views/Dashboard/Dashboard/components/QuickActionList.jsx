import { Heading, Icon, SimpleGrid } from "@chakra-ui/react";
import SmallQuickActionCard from "./SmallQuickActionCard";
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from "../../../../components/Icons/Icons";
import { FcGoogle } from "react-icons/fc";
import { BiSolidPhoneCall } from "react-icons/bi";

const QuickActionList = ({ iconBoxInside }) => {
  return (
    <>
      <Heading color="gray" textAlign="center" as="h3" size="md" mb="14px">
        Quick Actions
      </Heading>

      <SimpleGrid columns={{ sm: 1, md: 2, xl: 2 }} spacing="24px">
        <SmallQuickActionCard
          title={"Google Fit Integration"}
          amount={"$53,000"}
          percentage={55}
          height="120px"
          // width="60px"
          icon={
            <Icon as={FcGoogle} h={"24px"} w={"24px"} color={iconBoxInside} />
          }
        />
        <SmallQuickActionCard
          title={"Change Language"}
          amount={"2,300"}
          percentage={5}
          icon={
            <GlobeIcon
              color="#230b14"
              h={"24px"}
              w={"24px"}
              // color={iconBoxInside}
            />
          }
        />
        <SmallQuickActionCard
          title={"Listen into my Call"}
          amount={"+3,020"}
          percentage={-14}
          icon={
            <Icon
              as={BiSolidPhoneCall}
              color="#ddfafa"
              h={"24px"}
              w={"24px"}
              // color={iconBoxInside}
            />
          }
        />
        <SmallQuickActionCard
          title={"View Files"}
          amount={"$173,000"}
          percentage={8}
          icon={<DocumentIcon h={"24px"} w={"24px"} color={"#eeeeee"} />}
        />
      </SimpleGrid>
    </>
  );
};
export default QuickActionList;

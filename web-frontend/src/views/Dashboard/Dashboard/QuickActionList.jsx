import { SimpleGrid } from "@chakra-ui/react";
import SmallQuickActionCard from "./components/SmallQuickActionCard";
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from "../../../components/Icons/Icons";

const QuickActionList = ({ iconBoxInside }) => {
  return (
    <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px">
      <SmallQuickActionCard
        title={"Today's Moneys"}
        amount={"$53,000"}
        percentage={55}
        icon={<WalletIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
      />
      <SmallQuickActionCard
        title={"Change Language"}
        amount={"2,300"}
        percentage={5}
        icon={<GlobeIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
      />
      <SmallQuickActionCard
        title={"Change Language"}
        amount={"+3,020"}
        percentage={-14}
        icon={<DocumentIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
      />
      <SmallQuickActionCard
        title={"Total Sales"}
        amount={"$173,000"}
        percentage={8}
        icon={<CartIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
      />
    </SimpleGrid>
  );
};
export default QuickActionList;

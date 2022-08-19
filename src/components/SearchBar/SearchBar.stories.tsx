import { ComponentMeta } from "@storybook/react";

import SearchBar from ".";

export default {
  title: "Components/SearchBar",
  component: SearchBar,
} as ComponentMeta<typeof SearchBar>;

export const Default = () => <SearchBar disabled={false} />;

export const Disabled = () => <SearchBar disabled />;

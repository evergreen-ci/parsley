import { CaseSensitivity, MatchType } from "constants/enums";

type ParsedFilter = {
  name: string;
  visible: boolean;
  caseSensitive: CaseSensitivity;
  matchType: MatchType;
};

export type { ParsedFilter };

interface ButtonOpt {
  tag: "button";
  //onClick?: () => void;
}

interface AchorOption {
  tag: "a";
  href?: string;
}

export type Option = ButtonOpt | AchorOption;

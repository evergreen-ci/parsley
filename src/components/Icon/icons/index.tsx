import type { Size } from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";

const { black, green } = palette;

interface LeafygreenIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | typeof Size[keyof typeof Size];
  role?: "presentation" | "img";
  ["data-cy"]?: string;
}

export const ClosedEye: React.ComponentType<LeafygreenIconProps> = ({
  className,
  fill = black,
  onClick,
}) => (
  <svg
    aria-label="Closed Eye Icon"
    className={className}
    fill="none"
    height="16"
    onClick={onClick}
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 7h-1.385c0 1.436-3.769 4.308-5.615 4.308v1.077c2.154 0 7-2.244 7-5.385ZM1 7h1.385c0 1.436 3.769 4.308 5.615 4.308v1.077c-2.154 0-7-2.244-7-5.385Z"
      fill={fill}
    />
    <path
      d="M8 12.385c-2.154 0-7-2.244-7-5.385h1.385c0 1.436 3.769 4.308 5.615 4.308m0 1.077v-1.077m0 1.077c2.154 0 7-2.244 7-5.385h-1.385c0 1.436-3.769 4.308-5.615 4.308M1 11.038l.862-.808.43.404-.861.808L1 11.038Z"
      stroke={fill}
      strokeLinejoin="round"
    />
    <path
      d="M5.308 11.846h-.862l-.861 1.211L4 13.5l1.308-1.654ZM15 11.038l-.861-.808-.431.404.861.808.431-.404ZM10.421 11.757h.862l1.132 1.3-.43.404-1.564-1.704Z"
      stroke={fill}
      strokeLinejoin="round"
    />
    <path
      d="M7.462 12.385h1.076V14H7.462v-1.615Z"
      fill={fill}
      stroke={fill}
      strokeLinejoin="round"
    />
  </svg>
);

export const ArrowWithCircle: React.ComponentType<LeafygreenIconProps> = ({
  className,
  "data-cy": dataCy,
  onClick,
}) => (
  <svg
    aria-label="ArrowWithCircle Icon"
    className={className}
    data-cy={dataCy}
    fill="none"
    height="14"
    onClick={onClick}
    width="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M7 14A7 7 0 1 0 7 0a7 7 0 0 0 0 14Zm1.512-7.909h-5.4a.778.778 0 0 0-.779.778v.263c0 .43.349.778.778.778H8.51L7.317 9.103a.778.778 0 0 0 0 1.1l.186.186a.778.778 0 0 0 1.1 0l2.84-2.84a.778.778 0 0 0 0-1.1l-.187-.186a.966.966 0 0 0-.02-.02L8.603 3.612a.778.778 0 0 0-1.1 0l-.186.186a.778.778 0 0 0 0 1.1L8.512 6.09Z"
      fill="#001E2B"
      fillRule="evenodd"
    />
  </svg>
);

export const Expand: React.ComponentType<LeafygreenIconProps> = ({
  className,
  fill = black,
  size = 16,
}) => (
  <svg
    aria-label="Expand Icon"
    className={className}
    fill="none"
    height={size}
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 3v2.5a.5.5 0 1 1-1 0V4l-2.5 2.5a.707.707 0 0 1-1-1L12 3h-1.5a.5.5 0 1 1 0-1H13a1 1 0 0 1 1 1Z"
      fill={fill}
    />
    <path
      d="M12 3h-1.5a.5.5 0 1 1 0-1H13a1 1 0 0 1 1 1v2.5a.5.5 0 0 1-1 0V4m-1-1a1 1 0 0 1 1 1m-1-1L9.5 5.5a.707.707 0 0 0 1 1L13 4"
      stroke={fill}
    />
    <path
      d="M2 12V9a.5.5 0 1 1 1 0v2l2.5-2.5a.707.707 0 1 1 1 1L4 12h1.5a.5.5 0 1 1 0 1H3a1 1 0 0 1-1-1Z"
      fill={fill}
    />
    <path
      d="M4 12h1.5a.5.5 0 0 1 0 1H3a1 1 0 0 1-1-1V9a.5.5 0 0 1 1 0v2m1 1a1 1 0 0 1-1-1m1 1 2.5-2.5a.707.707 0 1 0-1-1L3 11"
      stroke={fill}
    />
  </svg>
);

/* Logos */
export const EvergreenLogo: React.ComponentType<LeafygreenIconProps> = ({
  className,
  fill = green.dark1,
  size = 16,
}) => (
  <svg
    aria-label="Evergreen Icon"
    className={className}
    fill="none"
    height={size}
    viewBox="0 0 258 258"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M144.206 213.445H114.693C110.693 213.445 107.449 216.688 107.449 220.689V250.201C107.449 254.202 110.693 257.445 114.693 257.445H144.206C148.206 257.445 151.449 254.202 151.449 250.201V220.689C151.449 216.688 148.206 213.445 144.206 213.445Z"
      fill={fill}
    />
    <path
      d="M237.92 218.638L188.116 155.363H71.0083L20.5234 218.649C16.5211 224.712 20.8722 232.791 28.1364 232.791H230.312C237.582 232.791 241.933 224.701 237.92 218.638Z"
      fill={fill}
    />
    <path
      d="M208.375 146.21L167.82 89.1536H90.4297L49.6287 146.227C45.6264 152.289 49.9774 160.369 57.2417 160.369H200.767C208.037 160.369 212.388 152.278 208.375 146.216V146.21Z"
      fill={fill}
    />
    <path
      d="M184.463 79.9953L132.867 2.05749C131.048 -0.689405 127.019 -0.684039 125.2 2.06286L73.7767 80.006C69.7744 86.0685 74.1254 94.1482 81.3897 94.1482H176.85C184.119 94.1482 188.47 86.0577 184.457 79.9953H184.463Z"
      fill={fill}
    />
  </svg>
);

interface ParsleyLogoProps extends LeafygreenIconProps {
  leftFill?: string;
  leftStroke?: string;
  rightFill?: string;
  stroke?: string;
  useStroke?: boolean;
}

export const ParsleyLogo: React.ComponentType<ParsleyLogoProps> = ({
  className,
  size = 16,
  leftFill = green.light1,
  rightFill = green.base,
  stroke = green.dark2,
  useStroke = false,
}) => (
  <svg
    className={className}
    fill="none"
    height={size}
    viewBox="0 0 279 279"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M146.034 172.244V91.7977C146.034 88.1885 143.109 85.2637 139.5 85.2637V178.778C143.109 178.778 146.034 175.853 146.034 172.244Z"
      fill={useStroke ? stroke : rightFill}
    />
    <path
      d="M220.231 225.9C221.751 225.962 223.254 225.548 224.53 224.713C230.696 220.471 232.625 211.551 229.69 200.853C229.161 198.919 229.55 196.845 230.743 195.232C231.935 193.619 233.807 192.649 235.814 192.592C253.752 192.105 265.798 183.32 265.803 175.423C265.803 167.525 253.752 158.745 235.814 158.263C233.807 158.206 231.935 157.236 230.743 155.623C229.55 154.011 229.161 151.942 229.69 150.002C232.625 139.304 230.696 130.385 224.525 126.137C222.98 125.074 221.134 124.525 219.256 124.571C212.93 124.571 203.927 129.27 193.504 134.715C186.98 138.122 179.58 141.985 171.444 145.439C168.986 146.481 166.139 145.921 164.257 144.028C162.374 142.135 161.835 139.288 162.893 136.83C168.773 123.835 175.541 111.26 183.159 99.1977C192.337 84.0036 200.256 70.8785 196.605 64.9824C194.743 61.9747 191.248 60.4449 186.223 60.4449C181.976 60.559 177.781 61.3835 173.803 62.8822C171.823 63.5874 169.624 63.297 167.892 62.0939C166.16 60.896 165.112 58.941 165.076 56.8356C164.671 33.1991 152.957 13.2341 139.5 13.2289V85.2585C143.109 85.2585 146.034 88.1833 146.034 91.7925V172.239C146.034 175.848 143.109 178.772 139.5 178.772V196.145C158.625 196.145 176.609 205.899 192.482 214.507C203.279 220.362 213.485 225.895 220.231 225.895V225.9ZM168.016 178.327C166.403 177.678 165.107 176.413 164.433 174.811C163.754 173.208 163.738 171.404 164.397 169.791C165.055 168.178 166.326 166.897 167.933 166.223C175.577 162.977 182.723 159.248 189.024 155.955C191.881 154.462 194.619 153.036 197.243 151.729C198.793 150.956 200.588 150.832 202.232 151.382C203.875 151.931 205.234 153.114 206.002 154.664C206.774 156.215 206.899 158.009 206.354 159.653C205.805 161.297 204.622 162.655 203.072 163.428C200.52 164.698 197.86 166.093 195.075 167.54C188.557 170.942 181.167 174.8 173.041 178.254C171.444 178.944 169.634 178.97 168.021 178.321L168.016 178.327Z"
      fill={rightFill}
    />
    <path
      d="M203.072 163.433C204.622 162.661 205.805 161.302 206.354 159.658C206.904 158.014 206.78 156.22 206.002 154.669C205.234 153.119 203.876 151.936 202.232 151.387C200.588 150.837 198.794 150.962 197.243 151.734C194.619 153.041 191.881 154.467 189.024 155.961C182.723 159.253 175.577 162.982 167.933 166.228C166.326 166.897 165.055 168.183 164.397 169.796C163.738 171.409 163.754 173.213 164.433 174.816C165.112 176.418 166.404 177.684 168.016 178.332C169.634 178.98 171.439 178.954 173.036 178.264C181.162 174.816 188.552 170.958 195.07 167.551C197.855 166.099 200.515 164.709 203.067 163.438L203.072 163.433Z"
      fill={useStroke ? stroke : rightFill}
    />
    <path
      d="M146.034 272.427V209.705C159.782 211.655 173.736 219.206 186.249 225.994C199.084 232.958 210.166 238.968 220.231 238.968C224.401 239.036 228.487 237.822 231.936 235.478C241.14 229.141 245.341 218.075 243.8 205.028C264.248 202.16 278.871 190.223 278.871 175.428C278.871 160.643 264.248 148.701 243.806 145.838C245.351 132.786 241.145 121.719 231.936 115.382C228.207 112.815 223.778 111.467 219.256 111.514C209.72 111.514 199.4 116.902 187.452 123.145C186.011 123.897 184.528 124.67 183.008 125.458C186.778 118.504 190.704 112.006 194.349 105.965C206.209 86.3216 215.575 70.8111 207.718 58.1217C202.211 49.2178 191 45.6086 177.615 48.2948C174.53 20.7327 158.739 0.181702 139.505 0.181702V13.2497C152.962 13.2497 164.677 33.2199 165.081 56.8564C165.118 58.9618 166.165 60.9168 167.897 62.1147C169.624 63.3126 171.823 63.6082 173.809 62.9029C177.781 61.4042 181.982 60.5797 186.229 60.4656C191.254 60.4656 194.749 61.9954 196.61 65.0031C200.261 70.8993 192.343 84.0191 183.164 99.2185C175.546 111.28 168.774 123.856 162.898 136.851C161.84 139.304 162.38 142.151 164.262 144.049C166.144 145.942 168.991 146.502 171.449 145.459C179.591 142.006 186.986 138.142 193.509 134.735C203.933 129.29 212.935 124.592 219.262 124.592C221.139 124.546 222.985 125.09 224.53 126.158C230.701 130.405 232.625 139.325 229.695 150.023C229.166 151.957 229.555 154.031 230.748 155.644C231.941 157.257 233.813 158.227 235.82 158.284C253.757 158.766 265.809 167.545 265.809 175.443C265.809 183.341 253.757 192.126 235.82 192.608C233.813 192.665 231.941 193.635 230.748 195.248C229.555 196.86 229.166 198.929 229.695 200.869C232.63 211.567 230.701 220.486 224.536 224.728C223.265 225.563 221.761 225.978 220.237 225.916C213.49 225.916 203.284 220.383 192.488 214.528C176.62 205.92 158.635 196.171 139.505 196.165V278.976C143.115 278.976 146.039 276.051 146.039 272.442L146.034 272.427Z"
      fill={useStroke ? stroke : rightFill}
    />
    <path
      d="M132.966 91.7977V172.244C132.966 175.853 135.891 178.778 139.5 178.778V85.2585C135.891 85.2585 132.966 88.1833 132.966 91.7925V91.7977Z"
      fill={useStroke ? stroke : leftFill}
    />
    <path
      d="M113.924 56.8512C113.888 58.9566 112.84 60.9116 111.108 62.1095C109.382 63.3074 107.183 63.603 105.197 62.8977C101.224 61.3991 97.024 60.5745 92.7769 60.4604C87.7467 60.4604 84.2567 61.9902 82.3899 65.0031C78.7391 70.8941 86.6629 84.014 95.8313 99.2029C103.449 111.27 110.227 123.845 116.102 136.851C117.16 139.304 116.621 142.151 114.738 144.044C112.856 145.937 110.009 146.497 107.551 145.454C99.4146 142.001 92.0249 138.142 85.5013 134.73C75.0728 129.285 66.0704 124.582 59.7387 124.582C57.8563 124.53 56.0102 125.08 54.4596 126.148C48.2938 130.39 46.3647 139.309 49.2998 150.007C49.8288 151.942 49.4399 154.016 48.2471 155.629C47.0544 157.241 45.1824 158.216 43.1755 158.268C25.2381 158.756 13.1865 167.53 13.1865 175.428C13.1865 183.326 25.2381 192.11 43.1755 192.592C45.1824 192.649 47.0544 193.619 48.2471 195.232C49.4399 196.845 49.8288 198.914 49.2998 200.853C46.3647 211.551 48.2938 220.466 54.4648 224.713C60.1535 228.628 72.9 221.887 86.5073 214.507C102.376 205.899 120.36 196.145 139.49 196.145V178.773C135.881 178.773 132.956 175.848 132.956 172.239V91.7977C132.956 88.1885 135.881 85.2637 139.49 85.2637V13.2445C126.033 13.2445 114.324 33.2147 113.914 56.8512H113.924ZM114.531 174.795C113.857 176.392 112.576 177.652 110.968 178.301C109.361 178.949 107.561 178.933 105.964 178.254C97.8329 174.8 90.4381 170.942 83.9145 167.54C81.1349 166.093 78.4747 164.704 75.9285 163.428C72.7704 161.784 71.5103 157.91 73.0971 154.721C74.6839 151.532 78.5369 150.204 81.7572 151.734C84.376 153.041 87.1089 154.467 89.961 155.955C96.2669 159.248 103.418 162.982 111.067 166.228C114.391 167.634 115.941 171.471 114.531 174.795Z"
      fill={leftFill}
    />
    <path
      d="M111.072 166.233C103.418 162.987 96.2717 159.253 89.9659 155.961C87.1138 154.472 84.3809 153.046 81.7621 151.739C78.5418 150.21 74.694 151.537 73.102 154.726C71.5151 157.916 72.7753 161.789 75.9334 163.433C78.4796 164.704 81.1398 166.093 83.9194 167.545C90.443 170.952 97.8378 174.811 105.969 178.259C107.566 178.938 109.366 178.954 110.973 178.306C112.581 177.658 113.862 176.392 114.536 174.795C115.946 171.471 114.396 167.639 111.072 166.228V166.233Z"
      fill={useStroke ? stroke : leftFill}
    />
    <path
      d="M139.5 0.181702C120.266 0.181702 104.481 20.7275 101.395 48.2896C87.9953 45.6086 76.7994 49.2126 71.2818 58.1165C63.4254 70.8059 72.7908 86.3164 84.6454 105.955C88.2909 111.996 92.2165 118.494 95.9917 125.453C94.4723 124.67 92.9996 123.902 91.5579 123.145C79.6049 116.907 69.2853 111.514 59.7488 111.514C55.2216 111.467 50.793 112.821 47.0645 115.382C37.8599 121.719 33.6542 132.786 35.1996 145.838C14.7523 148.701 0.133789 160.643 0.133789 175.428C0.133789 190.217 14.7523 202.16 35.1996 205.028C33.6542 218.075 37.8547 229.141 47.0697 235.483C50.5182 237.822 54.6045 239.041 58.7738 238.968C68.8393 238.968 79.9212 232.958 92.7507 225.994C105.264 219.206 119.219 211.655 132.966 209.705V272.427C132.966 276.036 135.891 278.961 139.5 278.961V196.15C120.37 196.15 102.386 205.904 86.5174 214.512C72.9049 221.892 60.1636 228.628 54.4749 224.718C48.3091 220.471 46.3748 211.551 49.3099 200.853C49.8389 198.919 49.4499 196.845 48.2572 195.237C47.0645 193.624 45.1925 192.655 43.1856 192.598C25.2482 192.115 13.1966 183.336 13.1966 175.433C13.1966 167.53 25.2482 158.756 43.1856 158.273C45.1925 158.216 47.0645 157.247 48.2572 155.634C49.4499 154.021 49.8389 151.952 49.3099 150.013C46.3748 139.314 48.3039 130.395 54.4697 126.148C56.015 125.08 57.8664 124.53 59.7488 124.582C66.0805 124.582 75.0829 129.285 85.5114 134.73C92.0298 138.137 99.4247 142.001 107.561 145.454C110.019 146.497 112.866 145.937 114.748 144.044C116.631 142.151 117.17 139.304 116.112 136.851C110.232 123.851 103.459 111.27 95.8413 99.2029C86.673 84.014 78.7544 70.8941 82.4 65.0031C84.2668 61.9902 87.762 60.4656 92.787 60.4656C97.0341 60.5797 101.234 61.4042 105.207 62.9029C107.188 63.6082 109.392 63.3178 111.118 62.1147C112.85 60.9168 113.898 58.9618 113.934 56.8564C114.339 33.2199 126.053 13.2497 139.51 13.2497V0.181702H139.5Z"
      fill={useStroke ? stroke : leftFill}
    />
  </svg>
);

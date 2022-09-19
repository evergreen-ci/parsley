import type { Size } from "@leafygreen-ui/icon";

interface LeafygreenIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | typeof Size[keyof typeof Size];
  role?: "presentation" | "img";
  ["data-cy"]?: string;
}

export const EvergreenLogo: React.ComponentType<LeafygreenIconProps> = ({
  className,
}) => (
  <svg
    aria-label="Evergreen Icon"
    className={className}
    height="28"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.884 0C4.59 8.35 2.294 16.864 0 25.214c2.032-.246 3.934-.49 6.065-.818-.528 3.34 0 .235-.528 3.604h2.858l-.527-3.604c.164 0 2.95.49 5.737.982-.82-3.438-3.77-1.99-6.72-5.92 1.638.818 4.425 1.5 5.9 1.663-.983-3.438-3.278-1.5-5.9-4.938 1.31.655 3.605 1.172 4.917 1.5-.984-3.439-2.623-1.827-4.918-4.774 1.148.49 2.95 1.008 3.934 1.335-.82-3.438-1.803-2.154-3.934-4.774.984.492 2.131.845 2.95 1.172-.382-1.527-.621-2.063-.968-2.449-.396-.441-.933-.687-1.982-1.997.656.327 1.311.68 1.967.844-.82-2.947-.164-1.99-1.967-4.119.492.164.656.354.984.517L6.884 0z"
      fill="#71CC97"
      fillRule="evenodd"
    />
  </svg>
);

export const LobsterLogo: React.ComponentType<LeafygreenIconProps> = ({
  className,
}) => (
  <svg
    className={className}
    fill="none"
    height="31"
    width="19"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M4.9.147a4.852 4.852 0 0 0-.863.433C3.535.91 2.624 1.835 2.262 2.385c-.387.589-.807 1.53-1.003 2.25-.157.578-.178.774-.182 1.699-.003.842.014 1.05.088 1.076.076.026.085-.051.054-.43C.98 4.137 2.939.88 5.237.29 5.771.151 6.191.2 6.717.46c.646.319 1.117.992 1.412 2.015.13.453.147.663.148 1.794 0 .705-.026 1.799-.058 2.43-.066 1.309 0 2.015.256 2.776.133.394.149.515.093.721-.049.183-.101.248-.198.248-.17 0-.298.304-.38.897-.055.404-.446 1.528-.533 1.532-.02 0-.091-.094-.16-.212-.197-.337-.894-1.034-1.034-1.034-.07 0-.334-.192-.587-.427-.252-.235-.649-.52-.88-.635-.643-.317-.711-.54-.235-.771.684-.332 1.237-.89 1.606-1.62.2-.394.38-.988.337-1.102-.017-.046.04-.274.127-.507.214-.57.444-1.648.456-2.132.007-.286-.026-.452-.118-.607-.208-.347-.326-.281-.65.361-.282.563-.679 1.17-.73 1.12-.046-.047.15-.697.258-.85a.59.59 0 0 0 .105-.268c0-.064.062-.178.137-.254.075-.075.168-.23.207-.344.072-.214.306-.536.61-.84.247-.248.202-.478-.1-.507-.676-.064-2.065.523-2.772 1.173-1.333 1.225-1.994 3.04-2.03 5.57-.014.944-.01.971.165 1.27.098.167.264.377.369.465.127.107.227.29.302.549.158.55.328.824.69 1.111.205.164.328.318.353.444.055.277.71.891 1.253 1.177.51.268.996.42 1.546.484l.37.043.005.39c.003.213.036.445.073.514.084.158.084.276 0 .496l-.065.175-.201-.17a.657.657 0 0 0-.46-.17c-.716 0-2.657-.981-2.85-1.441a.403.403 0 0 0-.299-.252c-.288-.074-.467-.354-.68-1.056-.094-.313-.198-.596-.23-.63-.033-.035-.06-.177-.06-.315 0-.286-.215-.759-.373-.82-.06-.023-.139.007-.186.071-.07.098-.087.08-.127-.137-.158-.848-.733-.255-.679.701.031.55.25.997.846 1.737.467.579.678.927.62 1.022-.071.114.097.402.442.76l.35.362 1.043.264c1.43.362 1.475.379 1.708.63.112.121.26.221.327.221s.233.031.368.069c.223.062.245.09.245.295 0 .125-.013.227-.03.227s-.148-.061-.291-.136c-.21-.11-.287-.121-.398-.062-.103.056-.234.056-.512 0-.685-.135-1.294-.318-1.724-.518-.263-.122-.481-.183-.57-.16-.105.027-.18-.009-.279-.134a.401.401 0 0 0-.324-.172c-.252 0-.593-.307-.857-.77a4.454 4.454 0 0 0-.385-.57 1.155 1.155 0 0 1-.22-.383c-.024-.1-.148-.284-.275-.412-.185-.185-.256-.219-.35-.168-.095.051-.134.032-.192-.098-.042-.092-.13-.161-.204-.161-.205 0-.285.234-.25.728.051.717.223.942 1.556 2.047.234.194.435.413.446.487.032.222.414.53.831.67.305.101 2.2.338 2.713.338.029 0 .164.088.3.197.205.163.307.197.595.197.372 0 .38.005.445.279.042.176.036.18-.238.18-.285 0-1.033-.312-1.434-.598-.163-.116-.259-.13-.681-.104-.528.034-.96.238-1.04.494-.023.069-.28.253-.575.413-.966.52-1.47 1.129-1.416 1.706.03.312.199.325.381.028.097-.157.277-.302.537-.434.227-.115.565-.374.802-.616.274-.278.492-.44.657-.485.136-.038.295-.11.354-.162.159-.14 1.829.277 2.066.514a.534.534 0 0 0 .359.164c.245 0 .53.107.53.198 0 .049-.038.049-.126.002a.354.354 0 0 0-.278-.012c-.156.058-.865-.056-1.154-.186-.5-.224-1.387.243-1.388.73 0 .06-.158.311-.351.559-.533.683-.651.955-.618 1.416.033.461.166.65.337.48.06-.06.108-.18.108-.268 0-.09.1-.27.229-.414.126-.14.33-.472.456-.739.125-.267.328-.597.451-.734l.224-.248.735.028c.407.016.766.061.806.101.04.04.18.073.312.073.237 0 .24.003.277.313.02.172-.004.504-.055.739-.125.585-.117.722.048.898.139.149.14.159.03.389-.181.382-.201.75-.052.97.114.168.12.217.047.427-.179.517-.177.651.009.824.144.134.159.178.09.26-.117.143-.027.941.116 1.022.095.053.09.086-.04.32-.172.305-.183.426-.05.538.085.07.06.125-.183.395-.343.382-.662 1.015-.79 1.562-.088.38-.086.415.032.566.069.088.265.212.436.277.17.064.422.21.56.327.296.25.601.32.958.224.222-.06.296-.05.507.063.317.17.65.17.931-.003.197-.12.258-.128.511-.064.377.095.714.004 1.063-.288.146-.123.352-.243.458-.266.256-.056.529-.32.529-.511 0-.46-.371-1.3-.815-1.847-.247-.304-.277-.37-.197-.438.126-.104.12-.165-.045-.509-.11-.229-.122-.301-.056-.342.126-.078.212-.786.118-.97-.063-.124-.053-.171.067-.299.17-.182.183-.465.037-.83-.1-.25-.098-.27.033-.437.171-.218.171-.323.003-.825l-.135-.4.14-.15c.134-.142.137-.176.068-.625-.04-.262-.088-.499-.106-.527-.017-.029-.012-.216.012-.418l.043-.365h.24c.131 0 .272-.033.312-.073.041-.042.393-.085.807-.1l.734-.028.225.248c.124.137.328.469.455.738.127.27.331.602.455.739.123.137.225.318.225.401 0 .083.037.203.082.265.072.098.1.101.207.022.087-.064.133-.198.154-.452.037-.453-.112-.816-.578-1.404-.184-.231-.364-.528-.4-.66-.08-.294-.37-.57-.72-.685-.216-.072-.316-.072-.568-.001-.722.202-1.133.267-1.26.199-.089-.048-.168-.046-.265.006-.11.06-.133.057-.11-.014.016-.048.204-.123.416-.166.24-.048.428-.128.495-.21.076-.095.368-.198 1.016-.358.792-.196.922-.213 1.015-.131.06.051.216.123.349.16.155.043.387.213.648.473.224.224.589.503.81.622.258.137.454.298.546.446.27.44.48.153.322-.443-.103-.389-.664-.925-1.357-1.296-.297-.16-.54-.315-.54-.347 0-.126-.406-.446-.638-.504-.566-.142-.825-.097-1.488.259-.688.368-1.346.53-1.345.328.003-.345.065-.4.457-.4.315 0 .414-.03.611-.187.252-.2.252-.2 1.843-.338.472-.041.94-.124 1.18-.209.415-.147.82-.466.82-.644 0-.122.331-.446.865-.848.446-.335.85-.764 1.006-1.066.143-.276.204-1.034.1-1.23-.102-.19-.318-.18-.41.02-.06.134-.095.15-.199.094-.104-.056-.163-.027-.345.166-.12.128-.239.32-.262.425a.693.693 0 0 1-.175.313c-.074.067-.253.32-.397.564-.321.543-.64.839-.904.839a.329.329 0 0 0-.3.164c-.086.131-.161.164-.38.164-.15 0-.33.04-.401.09-.407.28-2.056.681-2.345.571-.123-.047-.224-.03-.412.066-.137.07-.258.127-.268.127-.01 0-.019-.102-.019-.227 0-.206.022-.233.246-.295.135-.038.3-.069.367-.069s.215-.1.328-.223c.23-.25.541-.361 1.87-.668l.814-.188.38-.37c.365-.357.554-.667.48-.788-.058-.093.12-.387.611-1.008.594-.753.815-1.203.851-1.734.03-.43-.098-.912-.282-1.065-.148-.123-.36-.016-.364.185-.006.218-.115.507-.122.324-.008-.183-.244-.135-.398.082a1.192 1.192 0 0 0-.173.443c-.055.402-.488 1.716-.64 1.943-.078.115-.205.219-.284.23-.122.018-.413.29-.485.453-.028.065-.52.402-.907.622-.526.3-1.488.645-1.795.645-.218 0-.341.043-.495.172-.23.195-.22.197-.314-.084-.053-.156-.048-.269.02-.46.05-.138.091-.392.093-.564.002-.27.02-.312.136-.312.343 0 1.19-.23 1.635-.442.598-.287 1.375-1.015 1.375-1.29 0-.12.055-.198.19-.268.321-.167.63-.595.797-1.104.116-.352.237-.563.463-.81.366-.4.449-.66.45-1.412.001-2.938-.945-5.141-2.686-6.25-.717-.456-2.012-.835-2.279-.666-.179.113-.175.3.008.447.212.171.466.52.624.858.068.145.171.304.23.353.06.05.107.13.107.181 0 .05.072.232.16.403.154.3.287.803.211.803-.069 0-.464-.62-.732-1.15-.196-.386-.3-.525-.395-.525-.176 0-.357.386-.357.765 0 .38.205 1.391.42 2.07.089.284.18.653.202.82.069.536.507 1.334 1 1.825.349.346.895.712 1.244.832.009.003-.014.092-.05.198-.051.147-.17.241-.512.406a4.415 4.415 0 0 0-.91.64c-.256.234-.508.426-.56.426-.149 0-.657.48-.933.883-.137.2-.255.365-.262.365-.006 0-.131-.288-.278-.64-.16-.386-.28-.79-.3-1.016-.041-.464-.165-.736-.348-.762-.099-.014-.152-.082-.18-.23-.06-.304-.062-.291.132-.9.169-.531.178-.623.179-1.905 0-.74-.01-2.026-.024-2.857-.024-1.389-.014-1.552.114-2.013.726-2.606 2.762-3.084 4.803-1.129 1.416 1.357 2.24 3.43 2.14 5.385-.026.534-.015.68.052.68.138 0 .194-.914.106-1.72a7.321 7.321 0 0 0-.762-2.583C16.11 1.67 14.883.495 13.658.121c-1.577-.482-2.917.504-3.393 2.496-.161.675-.183 1.611-.095 3.985.051 1.373.045 1.647-.05 2.117-.12.586-.326 1.135-.428 1.135-.096 0-.16-.552-.108-.94.024-.187.12-.512.214-.722.112-.25.148-.402.105-.445-.114-.114-.26.003-.413.331l-.149.32-.172-.34c-.17-.338-.352-.462-.42-.286-.019.051.042.25.136.44.136.274.177.466.195.912.022.56-.044.828-.174.697-.035-.036-.146-.332-.246-.657-.182-.59-.182-.594-.156-2.168.054-3.26.043-3.84-.085-4.387C8.162 1.505 7.505.56 6.756.215 6.216-.034 5.49-.06 4.9.147Zm.66 2.85c0 .022-.126.165-.279.318-.539.539-.77.82-1.12 1.362-.648 1.001-1.189 2.31-1.454 3.518-.157.714-.256.69-.2-.05.167-2.224 1.066-3.96 2.555-4.935.373-.245.497-.298.497-.214Zm8.047.169c.447.254 1.187.952 1.484 1.4A7.15 7.15 0 0 1 16.13 7.23c.105.615.159 1.41.098 1.47-.021.022-.09-.176-.152-.438-.292-1.23-1-2.966-1.455-3.572-.084-.112-.153-.222-.153-.246 0-.073-.272-.384-.801-.92-.66-.665-.666-.704-.059-.36ZM4.85 11.084c.168.09.429.28.58.42.227.213.26.274.194.355-.044.053-.119.097-.165.097-.047 0-.341-.254-.653-.565-.583-.578-.574-.639.044-.307Zm8.98.315c-.416.412-.596.549-.684.52-.199-.063-.136-.262.158-.504.298-.244.881-.576 1.012-.576.044 0-.175.252-.486.56Zm3.193 1.138c-.147.291-.294.547-.326.567-.122.075-.133-.097-.024-.372.104-.262.534-.808.591-.751.014.014-.095.264-.241.556Zm-15.276-.291c.21.24.365.621.33.809-.017.084-.065.045-.18-.147-.204-.34-.464-.82-.464-.857 0-.09.142-.002.314.195Zm4.806.153c.268.28.644.84.644.961 0 .026-.066-.016-.148-.092a12.517 12.517 0 0 0-.622-.505c-.49-.377-.557-.49-.36-.605.165-.096.157-.1.486.242Zm6.042-.272c.184.071.11.266-.174.46a5.86 5.86 0 0 0-.748.6c-.224.207-.241.187-.092-.105.134-.265.763-.995.857-.995.03 0 .1.018.157.04Zm5.474 2.708c0 .098-.667.8-.726.764-.086-.054.189-.437.457-.637s.269-.2.269-.127Zm-16.994.282c.17.158.293.33.293.411 0 .118-.044.093-.28-.156-.392-.415-.472-.526-.382-.526.042 0 .207.122.369.271Zm2.835.004c.048.067.114.105.148.084.033-.02.06-.01.06.024 0 .033.096.108.213.166.2.1.204.105.05.105-.3 0-.917-.348-.917-.518 0-.096.36.015.446.139Zm11.31-.073c0 .108-.444.355-.761.423-.2.043-.179.018.204-.252.429-.301.557-.34.557-.171Zm-8.535 1.145c.159.134.175.172.09.204-.105.041-.43-.13-.43-.227 0-.057.07-.141.116-.141.016 0 .117.074.224.164Zm5.686-.037c0 .093-.273.267-.419.267-.12 0-.118-.01.026-.164.151-.161.393-.224.393-.102Zm-8.543.953c.264.131.293.162.16.164-.262.005-.639-.121-.68-.227-.055-.146.148-.122.52.063Zm11.556-.091c0 .1-.42.26-.67.255-.212-.004-.211-.006.113-.159.358-.17.557-.204.557-.096Zm-8.88.687c.16.121.122.161-.11.117-.098-.02-.18-.076-.18-.126 0-.117.13-.113.29.01Zm5.998-.036c0 .078-.26.223-.31.173-.054-.054.115-.236.22-.236.05 0 .09.028.09.063Zm-7.457.894c.11.057.185.117.168.134-.053.054-.365-.049-.445-.145-.105-.128.02-.123.277.01Zm8.898-.013c0 .094-.197.172-.426.168-.098 0-.073-.033.098-.127.278-.152.328-.159.328-.04Zm-7.172.698c.022.036-.005.065-.061.065-.057 0-.103-.03-.103-.065 0-.036.028-.066.062-.066s.08.03.102.066Zm5.305 0c-.022.036-.068.065-.102.065-.034 0-.062-.03-.062-.065 0-.036.046-.066.103-.066.056 0 .083.03.061.066Zm-6.517.866c.072.046.054.052-.065.026-.09-.02-.2-.037-.246-.037-.045 0-.081-.033-.081-.071 0-.074.218-.029.392.082Zm7.925-.045c-.044.054-.173.096-.286.093l-.205-.005.23-.088c.304-.118.359-.118.261 0Z"
      fill="#DB3030"
      fillRule="evenodd"
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
      d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM8.51235 6.09146L3.11113 6.09146C2.68158 6.09146 2.33336 6.43968 2.33336 6.86924V7.13203C2.33336 7.56159 2.68158 7.90981 3.11114 7.90981L8.50984 7.90981L7.31667 9.10298C7.01293 9.40672 7.01293 9.89919 7.31667 10.2029L7.5025 10.3888C7.80624 10.6925 8.2987 10.6925 8.60244 10.3888L11.4422 7.54897C11.746 7.24523 11.746 6.75276 11.4422 6.44902L11.2564 6.2632C11.2494 6.25622 11.2423 6.24939 11.2352 6.24273L8.60422 3.6118C8.30048 3.30806 7.80802 3.30806 7.50428 3.6118L7.31845 3.79762C7.01471 4.10136 7.01471 4.59382 7.31845 4.89756L8.51235 6.09146Z"
      fill="#001E2B"
      fillRule="evenodd"
    />
  </svg>
);

export const Expand: React.ComponentType<LeafygreenIconProps> = ({
  className,
}) => (
  <svg
    aria-label="Expand Icon"
    className={className}
    fill="none"
    height="16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 3v2.5a.5.5 0 1 1-1 0V4l-2.5 2.5a.707.707 0 0 1-1-1L12 3h-1.5a.5.5 0 1 1 0-1H13a1 1 0 0 1 1 1Z"
      fill="#001E2B"
    />
    <path
      d="M12 3h-1.5a.5.5 0 1 1 0-1H13a1 1 0 0 1 1 1v2.5a.5.5 0 0 1-1 0V4m-1-1a1 1 0 0 1 1 1m-1-1L9.5 5.5a.707.707 0 0 0 1 1L13 4"
      stroke="#001E2B"
    />
    <path
      d="M2 12V9a.5.5 0 1 1 1 0v2l2.5-2.5a.707.707 0 1 1 1 1L4 12h1.5a.5.5 0 1 1 0 1H3a1 1 0 0 1-1-1Z"
      fill="#001E2B"
    />
    <path
      d="M4 12h1.5a.5.5 0 0 1 0 1H3a1 1 0 0 1-1-1V9a.5.5 0 0 1 1 0v2m1 1a1 1 0 0 1-1-1m1 1 2.5-2.5a.707.707 0 1 0-1-1L3 11"
      stroke="#001E2B"
    />
  </svg>
);

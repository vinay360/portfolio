import {
  DeviceMobileCameraIcon,
  DropboxLogoIcon,
  HardDriveIcon,
  HeadphonesIcon,
  KeyboardIcon,
  LampPendantIcon,
  LaptopIcon,
  LecternIcon,
  LightbulbIcon,
  MicrophoneIcon,
  MonitorIcon,
  MonitorArrowUpIcon,
  MouseMiddleClickIcon,
  NumpadIcon,
  PuzzlePieceIcon,
} from "@phosphor-icons/react/dist/ssr";

export interface Device {
  name: string;
  href: string;
  icon: React.ReactNode;
}
export interface LinkItem {
  name: string;
  href: string;
}

export const devices: Device[] = [
  { name: "Apple MacBook Pro 16\"in M4 48GB 512GB", href: "https://amzn.to/3LBBQwN", icon: <LaptopIcon className="size-4" /> },
  { name: "Samsung S23 (256 GB)", href: "https://amzn.to/4bjDi19", icon: <DeviceMobileCameraIcon className="size-4" /> },
  { name: "LG Ultragear Monitor 27GS65F (27 inch, 68.5 cm)", href: "https://amzn.to/4q2xahA", icon: <MonitorIcon className="size-4" /> },
  { name: "LG Curved Ultra Wide Monitor 34WR50QK (34 inch, 86.36 cm)", href: "https://amzn.to/49FNZtH", icon: <MonitorArrowUpIcon className="size-4" /> },
  { name: "Monitor Stand with Laptop", href: "https://amzn.to/49T8YrN", icon: <MonitorIcon className="size-4" /> },
  { name: "Magic Keyboard", href: "https://amzn.to/3NEervh", icon: <KeyboardIcon className="size-4" /> },
  { name: "Logitech MX Master 3S Mouse", href: "https://amzn.to/4k1Zqzq", icon: <MouseMiddleClickIcon className="size-4" /> },
  { name: "Mouse Pad", href: "https://amzn.to/4t0bqFw", icon: <NumpadIcon className="size-4" /> },
  { name: "FIFINE K688 Podcast Microphone", href: "https://amzn.to/4acxN3c", icon: <MicrophoneIcon className="size-4" /> },
  { name: "Crossbeats Roar 2.0 (Special Addition)", href: "https://amzn.to/462JM0R", icon: <HeadphonesIcon className="size-4" /> },
  { name: "Smart LED Light Strip (Tapo L900-5)", href: "https://amzn.to/4qzlWC8", icon: <LightbulbIcon className="size-4" /> },
  { name: "DIGITEK Lite (DCL-150WBC Combo) - keylight", href: "https://amzn.to/4qH5boM", icon: <LampPendantIcon className="size-4" /> },
  { name: "Godox Softbox SB-GUE80", href: "https://amzn.to/4pUlBJj", icon: <DropboxLogoIcon className="size-4 rotate-180" /> },
  { name: "Boom Arm Holder for Light", href: "https://amzn.to/49WHS2Y", icon: <LecternIcon className="size-4" /> },
  { name: "Samsung T7 2TB SSD", href: "https://amzn.to/4qGRQwP", icon: <HardDriveIcon className="size-4" /> },
];

export const extensions: LinkItem[] = [
  {
    "href": "https://unhook.app/",
    "name": "Unhook"
  },
  {
    "href": "https://ublockorigin.com/",
    "name": "uBlock Origin"
  },
  {
    "href": "https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en",
    "name": "React Developer Tools"
  },
  {
    "href": "https://daily.dev/",
    "name": "daily.dev"
  },
  {
    "href": "https://www.grammarly.com/",
    "name": "Grammarly"
  },
  {
    "href": "https://www.wappalyzer.com/",
    "name": "Wappalyzer"
  },
  {
    "href": "https://chromewebstore.google.com/detail/colorzilla/bhlhnicpbhignbdhedgjhgdocnmhomnp?hl=en",
    "name": "ColorZilla"
  }
];

export const software: LinkItem[] = [
  {
    "href": "https://www.diabrowser.com/",
    "name": "Dia"
  },
  {
    "href": "https://www.notion.so/desktop",
    "name": "Notion"
  },
  {
    "href": "https://ticktick.com/download",
    "name": "TickTick"
  },
  {
    "href": "https://obsproject.com/",
    "name": "OBS Studio"
  },
  {
    "href": "https://www.videolan.org/vlc/",
    "name": "VLC"
  },
  {
    "href": "https://ghostty.org/",
    "name": "Ghostty"
  }
];

export const extensionsIcon = <PuzzlePieceIcon className="size-4" />;
export const softwareIcon = <MonitorIcon className="size-4" />;

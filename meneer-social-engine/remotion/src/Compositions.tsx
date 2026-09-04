import "./brand/font";
import { Composition, Still } from "remotion";
import { MM } from "./brand/tokens";
import { AvatarBlauwdruk } from "./compositions/avatars/AvatarBlauwdruk";
import { AvatarCenter } from "./compositions/avatars/AvatarCenter";
import { AvatarBolhoed } from "./compositions/avatars/AvatarBolhoed";
import { AvatarDoorkijk } from "./compositions/avatars/AvatarDoorkijk";
import { AvatarGroeisnor } from "./compositions/avatars/AvatarGroeisnor";
import { AvatarIcoon } from "./compositions/avatars/AvatarIcoon";
import { AvatarLetter } from "./compositions/avatars/AvatarLetter";
import { AvatarPijl } from "./compositions/avatars/AvatarPijl";
import { AvatarSite } from "./compositions/avatars/AvatarSite";
import {
  AVATAR_SHEET_V3,
  AvatarSheetV3,
} from "./compositions/avatars/AvatarSheetV3";
import { AvatarZegel } from "./compositions/avatars/AvatarZegel";
import { AVATAR_SHEET, AvatarSheet } from "./compositions/avatars/AvatarSheet";
import { AVATAR_CANVAS } from "./compositions/avatars/avatarShared";
import { AVATAR_SIZE, Avatar, avatarDefaultProps } from "./compositions/Avatar";
import { AvatarPreview } from "./compositions/AvatarPreview";
import {
  AVATAR_INSPECT_SIZE,
  AvatarInspect,
} from "./compositions/AvatarInspect";
import { AvatarInspectMinimal } from "./compositions/AvatarInspectMinimal";
import {
  AvatarInspectPreview,
  AvatarMinimalPreview,
} from "./compositions/AvatarInspectPreview";
import {
  DE_REKENING_DURATION_SEC,
  DeRekeningReel,
  deRekeningDefaultProps,
} from "./compositions/DeRekeningReel";
import {
  HONDERD_BEZOEKERS_DURATION_FRAMES,
  HonderdBezoekersReel,
  honderdBezoekersDefaultProps,
} from "./compositions/HonderdBezoekersReel";
import {
  MENEER_FIXT_DURATION_SEC,
  MeneerFixtReel,
  meneerFixtDefaultProps,
} from "./compositions/MeneerFixtReel";
import {
  MENEER_ZEGT_DURATION_SEC,
  MeneerZegtReel,
  meneerZegtDefaultProps,
} from "./compositions/MeneerZegtReel";

export const RemotionCompositions = () => {
  const { width, height, fps } = MM.reel;

  return (
    <>
      <Still
        id="AvatarCenter"
        component={AvatarCenter}
        width={AVATAR_CANVAS}
        height={AVATAR_CANVAS}
      />
      <Still
        id="AvatarSheetV3"
        component={AvatarSheetV3}
        width={AVATAR_SHEET_V3.width}
        height={AVATAR_SHEET_V3.height}
      />
      <Still
        id="AvatarLetter"
        component={AvatarLetter}
        width={AVATAR_CANVAS}
        height={AVATAR_CANVAS}
      />
      <Still
        id="AvatarSite"
        component={AvatarSite}
        width={AVATAR_CANVAS}
        height={AVATAR_CANVAS}
      />
      <Still
        id="AvatarZegel"
        component={AvatarZegel}
        width={AVATAR_CANVAS}
        height={AVATAR_CANVAS}
      />
      <Still
        id="AvatarPijl"
        component={AvatarPijl}
        width={AVATAR_CANVAS}
        height={AVATAR_CANVAS}
      />
      <Still
        id="AvatarIcoon"
        component={AvatarIcoon}
        width={AVATAR_CANVAS}
        height={AVATAR_CANVAS}
      />
      <Still
        id="AvatarSheet"
        component={AvatarSheet}
        width={AVATAR_SHEET.width}
        height={AVATAR_SHEET.height}
      />
      <Still
        id="AvatarDoorkijk"
        component={AvatarDoorkijk}
        width={AVATAR_CANVAS}
        height={AVATAR_CANVAS}
      />
      <Still
        id="AvatarGroeisnor"
        component={AvatarGroeisnor}
        width={AVATAR_CANVAS}
        height={AVATAR_CANVAS}
      />
      <Still
        id="AvatarBlauwdruk"
        component={AvatarBlauwdruk}
        width={AVATAR_CANVAS}
        height={AVATAR_CANVAS}
      />
      <Still
        id="AvatarBolhoed"
        component={AvatarBolhoed}
        width={AVATAR_CANVAS}
        height={AVATAR_CANVAS}
      />

      <Still
        id="AvatarInspect"
        component={AvatarInspect}
        width={AVATAR_INSPECT_SIZE}
        height={AVATAR_INSPECT_SIZE}
      />
      <Still
        id="AvatarInspectMinimal"
        component={AvatarInspectMinimal}
        width={AVATAR_INSPECT_SIZE}
        height={AVATAR_INSPECT_SIZE}
      />
      <Still
        id="AvatarInspectCheck"
        component={AvatarInspectPreview}
        width={1720}
        height={520}
      />
      <Still
        id="AvatarMinimalCheck"
        component={AvatarMinimalPreview}
        width={1720}
        height={520}
      />

      <Still
        id="AvatarOranje"
        component={Avatar}
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        defaultProps={avatarDefaultProps}
      />
      <Still
        id="AvatarOranjeStrak"
        component={Avatar}
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        defaultProps={{ ...avatarDefaultProps, showGrid: false }}
      />
      <Still
        id="AvatarOranjeDiep"
        component={Avatar}
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        defaultProps={{
          ...avatarDefaultProps,
          background: "#c2410c",
          gridColor: "rgba(255,255,255,0.09)",
        }}
      />
      <Still
        id="AvatarNavy"
        component={Avatar}
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        defaultProps={{
          ...avatarDefaultProps,
          background: "#0F172A",
          bandColor: "#FF5722",
          gridColor: "rgba(255,255,255,0.07)",
        }}
      />

      <Still
        id="AvatarCheck"
        component={AvatarPreview}
        width={1720}
        height={520}
        defaultProps={avatarDefaultProps}
      />

      <Composition
        id="HonderdBezoekers"
        component={HonderdBezoekersReel}
        durationInFrames={HONDERD_BEZOEKERS_DURATION_FRAMES}
        fps={fps}
        width={width}
        height={height}
        defaultProps={honderdBezoekersDefaultProps}
      />
      <Composition
        id="DeRekening"
        component={DeRekeningReel}
        durationInFrames={DE_REKENING_DURATION_SEC * fps}
        fps={fps}
        width={width}
        height={height}
        defaultProps={deRekeningDefaultProps}
      />
      <Composition
        id="MeneerFixt"
        component={MeneerFixtReel}
        durationInFrames={MENEER_FIXT_DURATION_SEC * fps}
        fps={fps}
        width={width}
        height={height}
        defaultProps={meneerFixtDefaultProps}
      />
      <Composition
        id="MeneerZegt"
        component={MeneerZegtReel}
        durationInFrames={MENEER_ZEGT_DURATION_SEC * fps}
        fps={fps}
        width={width}
        height={height}
        defaultProps={meneerZegtDefaultProps}
      />
    </>
  );
};

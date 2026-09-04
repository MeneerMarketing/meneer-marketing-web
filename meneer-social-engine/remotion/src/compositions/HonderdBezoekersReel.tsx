import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { EASE_SLAM, beat } from "../brand/beat";
import { fontFamily } from "../brand/font";
import { MM } from "../brand/tokens";
import { MeneerHead } from "../components/MeneerHead";
import { DrawnCheck, SlamCard, Ticker, WordPunch } from "../components/reel/Kinetic";
import {
  FoldLine,
  LameTitleCard,
  SiteMock,
  SlowLoadBar,
  TripleCheck,
} from "../components/reel/ReasonVisuals";
import {
  FormatPill,
  Kicker,
  MeneerStamp,
  ReelFooter,
  SceneShell,
} from "../components/reel/ReelChrome";
import {
  VISITOR_GRID_SIZE,
  VisitorGrid,
  scanPosition,
} from "../components/reel/VisitorGrid";

export const honderdBezoekersSchema = z.object({
  visitors: z.number(),
  leadsBefore: z.number(),
  leadsAfter: z.number(),
  monthlyValue: z.number(),
  loadSeconds: z.number(),
  fixedLoadTime: z.string(),
  lameTitle: z.string(),
  cases: z.string(),
});

export type HonderdBezoekersProps = z.infer<typeof honderdBezoekersSchema>;

export const honderdBezoekersDefaultProps: HonderdBezoekersProps = {
  visitors: 100,
  leadsBefore: 3,
  leadsAfter: 11,
  monthlyValue: 2140,
  loadSeconds: 6.4,
  fixedLoadTime: "1,8 seconden",
  lameTitle: "Welkom op onze website",
  cases: "Zo pakte ik het aan bij SkinComplete en BestRest.",
};

/* Koude opening: het getal staat er voordat je kunt wegswipen. */
const ColdOpen: React.FC<{ visitors: number }> = ({ visitors }) => {
  const frame = useCurrentFrame();

  const slam = interpolate(frame, [0, 11], [1.55, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_SLAM),
  });

  const glow = interpolate(frame, [0, 8], [0.55, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell tone="dark" align="center" flash={false} drift={false}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <span
          style={{
            fontFamily,
            fontSize: 460,
            fontWeight: 800,
            lineHeight: 0.82,
            letterSpacing: "-0.06em",
            color: "#ffffff",
            scale: slam,
            textShadow: `0 0 ${glow * 90}px rgba(255,87,34,${glow})`,
          }}
        >
          {visitors}
        </span>
        <WordPunch
          text="mensen waren vandaag op je site."
          fontSize={64}
          delay={9}
          stagger={2}
          color="#f8fafc"
          weight={700}
        />
      </div>
    </SceneShell>
  );
};

/* De bezoekers landen in het brand-grid. */
const ArriveScene: React.FC<{ visitors: number }> = ({ visitors }) => (
  <SceneShell tone="light" align="center">
    <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Kicker tone="light">Vandaag binnengelopen</Kicker>
        <Ticker from={0} to={visitors} duration={36} delay={4} fontSize={190} />
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <VisitorGrid mode="arrive" total={visitors} />
      </div>

      <WordPunch
        text="Eén bolletje is één mens met een probleem."
        fontSize={50}
        delay={34}
        stagger={2}
        weight={700}
        color="rgba(15,23,42,0.72)"
      />
    </div>
  </SceneShell>
);

/* De leegloop. Hier gebeurt het hele punt van de reel. */
const LeakScene: React.FC<{ visitors: number; leadsBefore: number }> = ({
  visitors,
  leadsBefore,
}) => (
  <SceneShell tone="light" align="center">
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Kicker tone="light">Drie klikken later</Kicker>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 26 }}>
          <Ticker
            from={visitors}
            to={leadsBefore}
            delay={10}
            duration={46}
            fontSize={190}
            color={MM.accentBold}
          />
          <span
            style={{
              fontFamily,
              fontSize: 52,
              fontWeight: 700,
              paddingBottom: 22,
              color: "rgba(15,23,42,0.6)",
            }}
          >
            namen contact op
          </span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <VisitorGrid mode="leak" total={visitors} keepCount={leadsBefore} />
      </div>

      <WordPunch
        text="De rest is weg. Jij weet niet waarom."
        fontSize={58}
        delay={62}
        stagger={2}
        weight={800}
        mark={["waarom."]}
      />
    </div>
  </SceneShell>
);

/* Elke reden krijgt een eigen beeld, zodat het geen tekstkaart blijft. */
const ReasonScene: React.FC<{
  kicker: string;
  headline: string;
  detail: string;
  visual: React.ReactNode;
  headlineSize?: number;
}> = ({ kicker, headline, detail, visual, headlineSize = 118 }) => (
  <SceneShell tone="dark" align="center">
    <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
      <Kicker tone="dark">{kicker}</Kicker>

      <WordPunch
        text={headline}
        fontSize={headlineSize}
        delay={2}
        stagger={2}
        color="#ffffff"
        weight={800}
        lineHeight={1.0}
      />

      {visual}

      <WordPunch
        text={detail}
        fontSize={46}
        delay={18}
        stagger={2}
        color="rgba(248,250,252,0.68)"
        weight={600}
      />
    </div>
  </SceneShell>
);

/* Meneer leunt het kader binnen en scant mee. Zijn ogen volgen de scanner. */
const MeneerScene: React.FC<{ cases: string }> = ({ cases }) => {
  const frame = useCurrentFrame();
  const scan = scanPosition(frame, 70);

  const headIn = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_SLAM),
  });

  const scannerOpacity = interpolate(frame, [8, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell tone="light" align="center">
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <FormatPill label="Meneer kijkt mee" delay={4} />

        <WordPunch
          text="Ik kijk vijftien minuten naar je site. Daarna weet je waar je geld blijft liggen."
          fontSize={62}
          delay={8}
          stagger={2}
          weight={800}
          mark={["geld", "liggen."]}
        />

        <WordPunch
          text={cases}
          fontSize={36}
          delay={48}
          stagger={2}
          weight={600}
          color="rgba(15,23,42,0.6)"
        />

        {/* De scanner blijft binnen de site-mock, zodat hij nooit door de tekst loopt. */}
        <div style={{ position: "relative" }}>
          <SiteMock />

          <div
            style={{
              position: "absolute",
              left: `${50 + scan.x * 25}%`,
              top: `${52 + scan.y * 24}%`,
              width: 230,
              height: 230,
              borderRadius: "50%",
              border: `6px dashed ${MM.accentBold}`,
              background: "rgba(255,87,34,0.08)",
              translate: "-50% -50%",
              opacity: scannerOpacity,
              rotate: `${frame * 0.8}deg`,
            }}
          />

          <div
            style={{
              position: "absolute",
              right: -120,
              bottom: -200,
              opacity: headIn,
              translate: `${(1 - headIn) * 220}px ${(1 - headIn) * 150}px`,
              rotate: `${interpolate(headIn, [0, 1], [18, -7])}deg`,
            }}
          >
            <svg viewBox="0 0 64 64" width={470} height={470}>
              <MeneerHead
                look={{ x: scan.x * 2.2, y: scan.y * 2.2 - 0.6 }}
                bandColor={MM.accentBold}
              />
            </svg>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

/* De fix. Drie kaarten, drie vinkjes, één belofte. */
const FixScene: React.FC<{ fixedLoadTime: string }> = ({ fixedLoadTime }) => {
  const fixes = [
    `${fixedLoadTime} laadtijd`,
    "Eén belofte boven de vouw",
    "Eén knop met een werkwoord erop",
  ];

  return (
    <SceneShell tone="light" align="center">
      <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        <Kicker tone="light">Wat ik zou doen</Kicker>

        {fixes.map((fix, i) => (
          <SlamCard key={fix} delay={6 + i * 22}>
            <DrawnCheck delay={12 + i * 22} />
            <span style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.14 }}>
              {fix}
            </span>
          </SlamCard>
        ))}

        <div style={{ marginTop: 22 }}>
          <WordPunch
            text="Zelfde site. Zelfde verkeer. Andere uitkomst."
            fontSize={54}
            delay={76}
            stagger={2}
            weight={800}
            mark={["uitkomst."]}
          />
        </div>
      </div>
    </SceneShell>
  );
};

/* De payoff. Dezelfde honderd mensen, meer gesprekken. */
const PayoffScene: React.FC<{
  visitors: number;
  leadsBefore: number;
  leadsAfter: number;
  monthlyValue: number;
}> = ({ visitors, leadsBefore, leadsAfter, monthlyValue }) => (
  <SceneShell tone="dark" align="center">
    <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Kicker tone="dark">Rekenvoorbeeld</Kicker>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
          <Ticker
            from={leadsBefore}
            to={leadsAfter}
            delay={12}
            duration={36}
            fontSize={180}
            color={MM.accentBold}
          />
          <span
            style={{
              fontFamily,
              fontSize: 50,
              fontWeight: 700,
              paddingBottom: 20,
              color: "rgba(248,250,252,0.65)",
            }}
          >
            gesprekken
          </span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: VISITOR_GRID_SIZE * 0.74,
            height: VISITOR_GRID_SIZE * 0.74,
          }}
        >
          <div style={{ scale: 0.74, transformOrigin: "top left" }}>
            <VisitorGrid
              mode="convert"
              total={visitors}
              keepCount={leadsBefore}
              convertCount={leadsAfter}
              tone="dark"
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <WordPunch
          text="Zelfde honderd mensen."
          fontSize={52}
          delay={54}
          stagger={2}
          color="rgba(248,250,252,0.7)"
          weight={700}
        />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
          <Ticker
            from={0}
            to={monthlyValue}
            delay={64}
            duration={30}
            fontSize={120}
            format="euro"
            color="#ffffff"
          />
          <span
            style={{
              fontFamily,
              fontSize: 44,
              fontWeight: 700,
              paddingBottom: 14,
              color: "rgba(248,250,252,0.65)",
            }}
          >
            per maand
          </span>
        </div>
      </div>
    </div>
  </SceneShell>
);

/* Afsluiter op oranje, zodat de reel opvalt in een feed vol wit. */
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();

  const stampScale = interpolate(frame, [18, 32], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_SLAM),
  });

  return (
    <SceneShell tone="accent" align="center">
      <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        <WordPunch
          text="Je verkeer is het probleem niet."
          fontSize={70}
          delay={2}
          stagger={2}
          color="rgba(255,255,255,0.82)"
          weight={700}
        />
        <WordPunch
          text="Je site is de bottleneck."
          fontSize={104}
          delay={12}
          stagger={2}
          color="#ffffff"
          weight={800}
        />
        <div style={{ display: "flex", marginTop: 14 }}>
          <MeneerStamp
            scale={stampScale}
            label="Stuur je URL."
            tone="accent"
            rotate="-2deg"
          />
        </div>
      </div>

      <ReelFooter tone="accent" look={{ x: 0, y: 1.6 }} />
    </SceneShell>
  );
};

export const HonderdBezoekersReel: React.FC<HonderdBezoekersProps> = (props) => (
  <AbsoluteFill style={{ fontFamily, background: MM.footer }}>
    <Sequence durationInFrames={beat(2)}>
      <ColdOpen visitors={props.visitors} />
    </Sequence>

    <Sequence from={beat(2)} durationInFrames={beat(4)}>
      <ArriveScene visitors={props.visitors} />
    </Sequence>

    <Sequence from={beat(6)} durationInFrames={beat(6)}>
      <LeakScene visitors={props.visitors} leadsBefore={props.leadsBefore} />
    </Sequence>

    <Sequence from={beat(12)} durationInFrames={beat(3)}>
      <ReasonScene
        kicker="Reden één"
        headline={`${props.loadSeconds.toFixed(1).replace(".", ",")} seconden`}
        detail="Na drie seconden is de helft al weg."
        visual={<SlowLoadBar totalSeconds={props.loadSeconds} delay={6} />}
      />
    </Sequence>

    <Sequence from={beat(15)} durationInFrames={beat(3)}>
      <ReasonScene
        kicker="Reden twee"
        headline="Onder de vouw"
        detail="Daar staat je belangrijkste knop."
        visual={<FoldLine delay={6} />}
      />
    </Sequence>

    <Sequence from={beat(18)} durationInFrames={beat(3)}>
      <ReasonScene
        kicker="Reden drie"
        headline={`"${props.lameTitle}"`}
        headlineSize={86}
        detail="Google leest hem ook. En denkt hetzelfde."
        visual={<LameTitleCard title={props.lameTitle} delay={8} />}
      />
    </Sequence>

    <Sequence from={beat(21)} durationInFrames={beat(3)}>
      <ReasonScene
        kicker="Het goede nieuws"
        headline="Alle drie te fixen"
        detail="Binnen een dag."
        visual={<TripleCheck delay={8} />}
      />
    </Sequence>

    <Sequence from={beat(24)} durationInFrames={beat(5)}>
      <MeneerScene cases={props.cases} />
    </Sequence>

    <Sequence from={beat(29)} durationInFrames={beat(8)}>
      <FixScene fixedLoadTime={props.fixedLoadTime} />
    </Sequence>

    <Sequence from={beat(37)} durationInFrames={beat(7)}>
      <PayoffScene
        visitors={props.visitors}
        leadsBefore={props.leadsBefore}
        leadsAfter={props.leadsAfter}
        monthlyValue={props.monthlyValue}
      />
    </Sequence>

    <Sequence from={beat(44)} durationInFrames={beat(4)}>
      <CtaScene />
    </Sequence>
  </AbsoluteFill>
);

/** 48 beats op 120 BPM, twaalf hele maten. */
export const HONDERD_BEZOEKERS_DURATION_FRAMES = beat(48);

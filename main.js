import ImageLayer from "ol/layer/Image.js";
import Map from "ol/Map.js";
import { Projection, fromLonLat, transformExtent } from "ol/proj";
import Static from "ol/source/ImageStatic.js";
import View from "ol/View.js";
import { getCenter } from "ol/extent.js";
import Draw from "ol/interaction/Draw.js";
import { Vector as VectorSource } from "ol/source.js";
import { Vector as VectorLayer } from "ol/layer.js";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import { Fill, Stroke, Style } from "ol/style";
import { Overlay } from "ol";
import "ol/ol.css";

const source = new VectorSource({ wrapX: false });

const vector = new VectorLayer({
  source: source,
});

// Map views always need a projection.  Here we just want to map image
// coordinates directly to map coordinates, so we create a projection that uses
// the image extent in pixels.
const extent = [0, 0, 1000, 703];
const projection = new Projection({
  code: "xkcd-image",
  units: "pixels",
  extent: extent,
});
let view = null;

function init() {
  const mapData = initMap();
  function addInteraction(map) {
    let draw = new Draw({
      source: source,
      type: "Polygon",
    });
    map.addInteraction(draw);

    draw.on("drawend", (evt) => {
      console.log(evt.feature.getGeometry()?.getExtent());

      const geom = [];
      geom.push(new Feature(evt.feature.getGeometry()));
      const writer = new GeoJSON();
      const geoJsonStr = writer.writeFeatures(geom);
      console.log(geoJsonStr);
    });
  }

  function capitalizeEachWord(text) {
    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");
  }

  function initAreas(map) {
    const polygonData = {
      "flower capital": {
        color: "#A1409F",
        fill: "#1AA1409F",
        fillSelected: "#33A1409F",
        description: `<p>The <b>Flower Capital</b><span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja">花の都</span><span class="t_nihongo_comma">,</span> <i><span class="t_nihongo_romaji">Hana no Miyako</span></i><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span> is in the center of the country, and is where the shogun <a href="/wiki/Kurozumi_Orochi" title="Kurozumi Orochi">Kurozumi Orochi</a> resides. It is currently the only prosperous place in Wano, due to the shogun's affiliation with the <a href="/wiki/Beasts_Pirates" title="Beasts Pirates">Beasts Pirates</a>. Mt. Fuji and the leftovers <b>Ebisu Town</b> are also included in the region the Flower Capital occupies.<sup id="cite_ref-c934_62-2" class="reference"><a href="#cite_note-c934-62">[62]</a></sup></p>`,
        image:
          "https://static.wikia.nocookie.net/onepiece/images/3/30/Flower_Capital_Infobox.png",
        geoJson:
          '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[660.2832941869118,444.3605515257993],[536.3270752150638,391.07620400396416],[397.7877716582924,449.40854234365736],[453.876558523382,527.9328439547828],[616.5340404321419,533.5417226412918],[660.2832941869118,444.3605515257993]]]},"properties":null}]}',
      },
      hakumai: {
        color: "#BB565E",
        fill: "#1ABB565E",
        fillSelected: "#33BB565E",
        description: `<p><b>Hakumai</b><span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja">白舞</span><span class="t_nihongo_comma">,</span> <i><span class="t_nihongo_romaji">Hakumai</span></i><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span> is located in the northeast.<sup id="cite_ref-c934_62-4" class="reference"><a href="#cite_note-c934-62">[62]</a></sup> It was ruled by the daimyo <a href="/wiki/Shimotsuki_Yasuie" title="Shimotsuki Yasuie">Shimotsuki Yasuie</a><sup id="cite_ref-81" class="reference"><a href="#cite_note-81">[81]</a></sup> and Yakuza boss <a href="/wiki/Tsunagoro" title="Tsunagoro">Tsunagoro</a> until Orochi's takeover.<sup id="cite_ref-Yakuza_boss_77-2" class="reference"><a href="#cite_note-Yakuza_boss-77">[77]</a></sup> Currently, it is filled with run down structures, with the exceptions being <b>Mogura Port</b><sup id="cite_ref-82" class="reference"><a href="#cite_note-82">[82]</a></sup> and <b>Habu Port</b>,<sup id="cite_ref-83" class="reference"><a href="#cite_note-83">[83]</a></sup> two of the major ports of Wano Country.<sup id="cite_ref-c954p9_79-1" class="reference"><a href="#cite_note-c954p9-79">[79]</a></sup> Habu Port is where the <a href="/wiki/Ninja-Pirate-Mink-Samurai_Alliance" title="Ninja-Pirate-Mink-Samurai Alliance">Ninja-Pirate-Mink-Samurai Alliance</a> initially planned to meet their allies before engaging in the battle to take down Kaidou.<sup id="cite_ref-84" class="reference"><a href="#cite_note-84">[84]</a></sup></p>`,
        image:
          "https://static.wikia.nocookie.net/onepiece/images/5/50/Hakumai_Infobox.png",
        geoJson:
          '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[668.1357243480243,435.3863456273849],[531.2790843972057,380.980222368248],[520.6222148928387,317.5998932106968],[545.3012811134781,317.5998932106968],[544.1795053761763,301.33414501982077],[550.6006662599106,302.6074896829156],[556.7041818849106,303.5840521829156],[564.5166818849106,304.3164740579156],[573.0616037599106,304.8047553079156],[578.6768381349106,304.8047553079156],[587.4659006349106,304.0723334329156],[595.0342600099106,302.6074896829156],[599.9170725099106,301.1426459329156],[598.6963693849106,311.3965521829156],[606.2647287599107,311.64069280791557],[618.9600412599107,308.71100530791557],[631.1670725099107,302.85163030791557],[656.0694162599107,293.08600530791557],[676.3330881349107,283.32038030791557],[700.2588693849106,269.64850530791557],[726.8701975099106,256.95319280791557],[754.2139475099106,247.18756780791563],[789.8584787599106,232.78327093291563],[823.3057443849104,226.92389593291563],[839.6631662599106,226.67975530791563],[862.3682443849106,227.90045843291563],[883.1201975099106,233.51569280791563],[903.6280100099106,244.50202093291563],[917.2998850099106,256.4649115579156],[927.7979318849106,265.25397405791557],[941.7139475099104,283.07623968291557],[946.5967600099104,294.30670843291557],[950.0147287599104,306.51373968291557],[948.7940256349104,318.47663030791557],[943.6670725099104,327.99811468291557],[919.7412912599106,336.78717718291557],[668.1357243480243,435.3863456273849]]]},"properties":null}]}',
      },
      udon: {
        color: "#DBB788",
        fill: "#1ADBB788",
        fillSelected: "#33DBB788",
        description: `<p><b>Udon</b><span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja">兎丼</span><span class="t_nihongo_comma">,</span> <i><span class="t_nihongo_romaji">Udon</span></i><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span> is located at the southeast. It was ruled by the daimyo <a href="/wiki/Uzuki_Tempura" title="Uzuki Tempura">Uzuki Tempura</a><sup id="cite_ref-sbs101_76-1" class="reference"><a href="#cite_note-sbs101-76">[76]</a></sup> and Yakuza boss <a href="/wiki/Omasa" title="Omasa">Omasa</a> until Orochi's takeover.<sup id="cite_ref-Yakuza_boss_77-1" class="reference"><a href="#cite_note-Yakuza_boss-77">[77]</a></sup> It is an industrialized region of weapon factories where the lower-class are forced to work to exhaustion and death. There is the <b>Prisoner Mine</b><span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja">囚人採掘場</span><span class="t_nihongo_comma">,</span> <i><span class="t_nihongo_romaji">Shūjin Saikutsujō</span></i><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span> where rebels are tortured until their wills break and they pledge allegiance to <a href="/wiki/Kaidou" title="Kaidou">Kaidou</a>.<sup id="cite_ref-c924_80-0" class="reference"><a href="#cite_note-c924-80">[80]</a></sup></p>`,
        image:
          "https://static.wikia.nocookie.net/onepiece/images/8/84/Udon_Infobox.png",
        geoJson:
          '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[522.1716406249549,381.22296863058386],[508.4997656249549,312.8635936305839],[370.560312499955,285.031562380584],[349.320078124955,279.904609255584],[332.474374999955,277.463203005584],[320.755624999955,276.242499880584],[292.923593749955,274.289374880584],[265.82398437495505,274.777656130584],[245.80445312495505,278.683906130584],[232.62085937495507,285.031562380584],[229.02827317106153,288.2752374871412],[228.78413254606153,291.6932062371412],[230.00483567106153,304.3885187371412],[260.5224137960615,432.0740656121411],[382.3485856710614,445.0135187371411],[522.1716406249549,381.22296863058386]]]},"properties":null}]}',
      },
      kuri: {
        color: "#55BAA0",
        fill: "#1A55BAA0",
        fillSelected: "#3355BAA0",
        description: `<p><b>Kuri</b><span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja">九里</span><span class="t_nihongo_comma">,</span> <i><span class="t_nihongo_romaji">Kuri</span></i><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span> is located in the south, and was formerly ruled by <a href="/wiki/Kozuki_Oden" title="Kozuki Oden">Kozuki Oden</a>.<sup id="cite_ref-74" class="reference"><a href="#cite_note-74">[74]</a></sup> Under the Beasts Pirates rule, Kuri had become a wasteland, polluted by the weapons factory that <a href="/wiki/Poison" title="Poison">poisoned</a> the fresh water rivers. The <b>Amigasa Village</b><span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja">編笠村</span><span class="t_nihongo_comma">,</span> <i><span class="t_nihongo_romaji">Amigasa-mura</span></i><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span> was located there before it was destroyed by the Beasts Pirates headliner, <a href="/wiki/X_Drake" title="X Drake">X Drake</a>. <b>Okobore Town</b><span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja">おこぼれ町</span><span class="t_nihongo_comma">,</span> <i><span class="t_nihongo_romaji">Okobore-chō</span></i><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span> is also located in Kuri. It is located on the other side of a large Torii, opposite to Bakura Town. It is a poor town as everything there is made from leftovers from the capital. <b>Bakura Town</b><span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja">博羅町</span><span class="t_nihongo_comma">,</span> <i><span class="t_nihongo_romaji">Bakura-chō</span></i><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span> is where the Beasts Pirates reside. It is located at the foot of the mountain where Oden's castle used to be, and it has a large Torii at its entrance.<sup id="cite_ref-75" class="reference"><a href="#cite_note-75">[75]</a></sup></p>`,
        image:
          "https://static.wikia.nocookie.net/onepiece/images/1/1b/Kuri_Infobox.png",
        geoJson:
          '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[287.34535919113887,565.3015792480271],[217.19440047586792,286.7213297344993],[182.19019378252582,259.0757189996536],[166.14163144206628,251.3640721607315],[145.92461135083803,242.40188799657875],[126.54128280976353,238.0250073582716],[102.98949651792032,235.73235559534882],[81.73036198899989,239.27554468350223],[71.93448627469341,241.77661933396345],[62.97230211054069,244.69453975950154],[53.17642639623422,251.15564927319303],[43.38055068192775,260.3262563248842],[36.0857496180825,271.9979380270366],[29.84922475440458,285.2965984233091],[24.84707545348213,301.34516076376855],[23.596538128251513,323.8548326179196],[24.013383903328386,355.32668863622337],[28.598687429173967,373.66790273960567],[34.42473199555749,389.1807134341804],[44.01218482232552,409.81457930048555],[52.765946098939814,426.07156452848346],[63.8123591384769,443.7875099692505],[78.61038415370584,468.1729878112475],[93.19998628139632,486.72262480216824],[119.46127011123906,511.73337130678044],[137.1772155520061,525.9061276593941],[163.85534515692584,541.7462671123152],[184.6976339107694,552.5842572643134],[207.62415153999734,562.5885558661582],[230.13382339414838,571.550740030311],[252.85191813583785,578.2202724315409],[268.06678892614366,579.2623868692331],[278.69635619060386,576.3444664436951],[285.78273436691063,571.7591629178495],[287.34535919113887,565.3015792480271]]]},"properties":null}]}',
      },
      kibi: {
        color: "#C5D04E",
        fill: "#1AC5D04E",
        fillSelected: "#33C5D04E",
        description: `<p><b>Kibi</b><span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja">希美</span><span class="t_nihongo_comma">,</span> <i><span class="t_nihongo_romaji">Kibi</span></i><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span> is a region on the west side of Wano Country. It was ruled by the daimyo <a href="/wiki/Fugetsu_Omusubi" title="Fugetsu Omusubi">Fugetsu Omusubi</a><sup id="cite_ref-sbs101_76-0" class="reference"><a href="#cite_note-sbs101-76">[76]</a></sup> and Yakuza boss <a href="/wiki/Yatappe" title="Yatappe">Yatappe</a> until Orochi's takeover.<sup id="cite_ref-Yakuza_boss_77-0" class="reference"><a href="#cite_note-Yakuza_boss-77">[77]</a></sup> Like several other places seen, much of it is a wasteland with factories located on top of rock formations.<sup id="cite_ref-78" class="reference"><a href="#cite_note-78">[78]</a></sup> It contains no known landmarks<sup id="cite_ref-c934_62-3" class="reference"><a href="#cite_note-c934-62">[62]</a></sup> except for <b>Neko Port</b><span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja"><ruby lang="ja"><rb>根子</rb><rp>（</rp><rt>ネコ</rt><rp>）</rp></ruby>港</span><span class="t_nihongo_comma">,</span> <i><span class="t_nihongo_romaji">Neko Minato</span></i><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span>. The port's name contains the kanji for "root"<span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja">根子</span><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span>. <i>Neko</i><span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja">猫, ネコ</span><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span> is also the Japanese word for "cat".<sup id="cite_ref-c954p9_79-0" class="reference"><a href="#cite_note-c954p9-79">[79]</a></sup></p>`,
        image:
          "https://static.wikia.nocookie.net/onepiece/images/b/b2/Kibi.png",
        geoJson:
          '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[299.09685830614,573.9850145318487],[263.4565445370675,443.51228693278824],[391.01135171059013,452.891316872018],[448.95291444627526,533.7593972369308],[467.9310122217082,537.8178360392127],[498.1523309147814,540.3189106896739],[544.2137890607756,541.7778709024429],[574.2266848663104,542.4031395650583],[598.1953169332305,541.5694480149045],[608.1996155350754,540.9441793522892],[617.578645474305,539.4852191395202],[624.2481778755349,537.6094131516743],[627.3464340111576,539.3283207405772],[633.1822748622338,539.9535894031925],[650.2729516403855,555.5853059685752],[660.6940960173073,565.1727587953433],[674.450006594844,580.387629585649],[684.6627280842274,595.6025003759548],[685.4964196343811,598.1035750264161],[683.2037678714584,601.4383412270311],[677.5763499079205,606.4404905279536],[665.6962453182298,610.1921025036454],[655.275100941308,611.8594856039529],[637.3507326130025,613.1100229291834],[593.2446771051285,616.8714808222735],[569.2760450382084,618.7472868101195],[544.6821443086731,619.9978241353501],[525.507238655137,620.8315156855039],[475.6139756341126,621.5392460015119],[444.35054250334724,617.9960569133584],[416.41026056376177,615.6975976457181],[393.4837429345339,611.9459856700263],[365.34665311684506,604.0259159435658],[341.378021049925,595.6890004420284],[322.17765195913444,587.8500364168331],[306.7543582812902,579.721543802834],[299.09685830614,573.9850145318487]]]},"properties":null}]}',
      },
      ringo: {
        color: "#6C69D5",
        fill: "#1A6C69D5",
        fillSelected: "#336C69D5",
        description: `<p><b>Ringo</b><span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja">鈴後</span><span class="t_nihongo_comma">,</span> <i><span class="t_nihongo_romaji">Ringo</span></i><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span> is located in the north. It was ruled by the daimyo <a href="/wiki/Shimotsuki_Ushimaru" title="Shimotsuki Ushimaru">Shimotsuki Ushimaru</a><sup id="cite_ref-85" class="reference"><a href="#cite_note-85">[85]</a></sup> and Yakuza boss <a href="/wiki/Cho" title="Cho">Cho</a> until Orochi's takeover.<sup id="cite_ref-Yakuza_boss_77-3" class="reference"><a href="#cite_note-Yakuza_boss-77">[77]</a></sup> It has a wintry climate. It contains the <b>Northern Cemetery</b>,<sup id="cite_ref-c934_62-5" class="reference"><a href="#cite_note-c934-62">[62]</a></sup> which is said to be haunted.<sup id="cite_ref-86" class="reference"><a href="#cite_note-86">[86]</a></sup> At the cemetery entrance is the <b>Oihagi Bridge</b>.</p>`,
        image:
          "https://static.wikia.nocookie.net/onepiece/images/6/69/Ringo_Infobox.png",
        geoJson:
          '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[631.280570784245,529.5501699608342],[689.1475284383002,587.4171276148903],[691.9801767150723,590.0474438718928],[697.038477209308,593.0824241684343],[703.715433861699,593.8917522475119],[714.2366988897093,593.2847561882037],[733.4582407678048,589.0357837730458],[779.5471537280985,576.8796095634609],[800.1850197445801,570.0003208913004],[823.4532020180642,561.0977120214455],[845.3050601531623,552.3974351713603],[867.9662463673382,539.8528499456557],[897.10376231438,521.9342782503827],[914.9089800540896,509.38969302467825],[933.7258578926463,492.7984674035852],[948.6984273555839,475.19558168364506],[961.6476766208273,455.97403980554947],[972.7090431598112,428.4301272975738],[975.5416914365832,413.4575578346362],[978.779003752894,394.2360159565406],[979.7906638517412,381.69143073083615],[977.767343654047,368.9445134853622],[974.1253672981973,358.01858441781314],[962.9971062108788,344.664671113031],[958.2310122524551,340.0694759654966],[952.5657156989112,337.43915970849406],[946.4957551058284,336.62983162941634],[938.8071383545902,338.4508198073412],[923.0252408125748,344.31844838065456],[768.5223132091643,408.4329793436954],[756.3823920229986,411.87262367977564],[740.8028265007528,415.3122680158559],[718.5935100076823,423.4055488066331],[700.5859602482033,431.4988295974101],[683.9947346271102,439.9967744277261],[676.9131139351803,443.84108280334533],[634.1512863356661,521.8017046999233],[631.280570784245,529.5501699608342]]]},"properties":null}]}',
      },
      onigashima: {
        color: "#000000",
        fill: "#1A000000",
        fillSelected: "#33000000",
        description: `<p><b>Onigashima</b><span style="font-weight: normal"> (<span class="t_nihongo_kanji" lang="ja">鬼ヶ島</span><span class="t_nihongo_comma">,</span> <i><span class="t_nihongo_romaji">Onigashima</span></i><span class="t_nihongo_help"><sup><a href="http://en.wikipedia.org/wiki/Help:Japanese" class="extiw" title="wikipedia:Help:Japanese"><span class="t_nihongo_icon" style="color:#00e;font:bold 80% sans-serif;text-decoration:none;padding:0 .1em;">?</span></a></sup></span>)</span> is an island south of Wano and is considered part of it.<sup id="cite_ref-c921_2-2" class="reference"><a href="#cite_note-c921-2">[2]</a></sup> It is where Kaidou resides, and where his underlings go to report to him.<sup id="cite_ref-c793_1-2" class="reference"><a href="#cite_note-c793-1">[1]</a></sup> Once a year, during the <a href="/wiki/Fire_Festival" title="Fire Festival">Fire Festival</a>, Orochi and his men travel there to celebrate with their allies the take over of Wano Country, under the ruse of paying their respects to the country's protector.<sup id="cite_ref-c921_2-3" class="reference"><a href="#cite_note-c921-2">[2]</a></sup><br style="clear:both"></p>`,
        image:
          "https://static.wikia.nocookie.net/onepiece/images/1/17/Onigashima_Infobox.png",
        geoJson:
          '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[404.4448301870524,137.82383156354882],[399.5085591507332,128.21573258214184],[395.894503570571,117.72615662996361],[395.27746969103106,109.61656849886782],[396.24709435887945,100.18476491161513],[401.44780848643,91.19369980974807],[407.0011134022891,83.96558864942357],[414.55869724918205,75.7909709229908],[423.0208761685863,69.00359824805193],[432.18823666460764,64.41991800004124],[435.39720078902883,63.150203211316814],[446.5919583178241,60.241329207771585],[462.45854379170714,59.09540914576892],[474.4980500841583,58.91911375161467],[491.6868510141983,58.566522963306156],[506.58381182023294,59.888738419463074],[518.7481940168766,61.21095387562],[535.7403577765137,64.38427097039667],[553.8106356773251,69.84942818917861],[565.2698362973517,73.99236995180364],[574.8779352787586,80.51529953551112],[584.5238436447523,90.42565099273587],[589.7245577723029,97.83005754721464],[594.1319426261593,107.1737134373902],[595.5423057793934,113.4321999298663],[595.5423057793934,122.24696963757911],[593.7793518378508,128.32916073590098],[588.958612157166,139.6240594045779],[583.7578980296154,147.99809062690508],[578.7334792962191,154.69731560476683],[572.3868451066659,160.77950670308866],[562.0732826087848,167.77146526021923],[555.6385007221544,171.64996393161286],[547.6170602881358,175.08772411762087],[540.212653733657,177.64400733285757],[534.0423149382581,179.40696127440017],[517.3824001906809,181.7869490954826],[502.2650701419535,183.19731224871666],[493.1858573430093,183.54990303702516],[485.51700769729916,182.93286915748527],[476.2614995042007,182.13953988379112],[456.2519722676925,179.23066588024594],[446.0268394067457,176.49808727085497],[436.9476266078015,172.88403169069272],[427.2513799293174,166.2729544099081],[418.87734870699,158.60410476419787],[412.53071451743676,151.90487978633612],[408.9166589372745,146.26342717339995],[405.39075105418937,140.1812360750781],[404.4448301870524,137.82383156354882]]]},"properties":null}]}',
      },
    };

    Object.keys(polygonData).forEach(async (x) => {
      const source = new VectorSource({
        features: new GeoJSON().readFeatures(
          JSON.parse(polygonData[x].geoJson)
        ),
      });
      const layer = new VectorLayer({
        source,
        style: [
          new Style({
            fill: new Fill({
              color: polygonData[x].fill,
            }),
          }),
        ],
      });

      const aTag = document.createElement("a");
      aTag.setAttribute("id", x);
      aTag.setAttribute("class", "overlay");
      aTag.setAttribute("style", "background-color: " + polygonData[x].color);
      aTag.setAttribute("data-area", JSON.stringify(polygonData[x]));
      aTag.innerHTML = capitalizeEachWord(x);

      //   Modal section
      const modal = document.getElementById("myModal");
      aTag.onclick = () => {
        const coord = getCenter(source.getExtent());
        const area = JSON.parse(aTag.getAttribute("data-area"));
        zoomInto(parseFloat(coord[0]), parseFloat(coord[1]));
        mapData.getAllLayers().forEach((x, i) => {
          if (i > 0) mapData.removeLayer(x);
        });

        const singleLayer = new VectorLayer({
          source,
          style: [
            new Style({
              fill: new Fill({
                color: polygonData[x].fillSelected,
              }),
            }),
          ],
        });
        mapData.addLayer(singleLayer);

        // modal.style.display = "block";

        // const title = document.getElementById("title");
        // title.innerHTML = capitalizeEachWord(x);
        // const image = document.getElementById("image");
        // image.src = area.image;
        // const desc = document.getElementById("desc");
        // desc.innerHTML = area.description;
        // const close = modal.getElementsByClassName("close");
        // close[0].onclick = () => {
        //   modal.style.display = "none";
        // };
        // window.onclick = (event) => {
        //   if (event.target == modal) {
        //     modal.style.display = "none";
        //   }
        // };
      };
      map.addLayer(layer);
      map.addOverlay(
        new Overlay({
          position: getCenter(source.getExtent()),
          positioning: x === "kibi" ? "bottom-right" : "center-center",
          element: aTag,
        })
      );
    });
  }

  function initMap() {
    try {
      view = new View({
        projection: projection,
        center: getCenter(extent),
        extent: [-100, -100, 1100, 803],
        zoom: 2,
        maxZoom: 8,
      });
      let map = new Map({
        layers: [
          new ImageLayer({
            source: new Static({
              attributions:
                '© <a href="https://xkcd.com/license.html">xkcd</a>',
              url: "https://rawcdn.githack.com/jasjuslover/wano-maps/24174a32f0060de63e9fa1eaf8b099270db9cfee/wano.webp",
              projection: projection,
              imageExtent: extent,
            }),
          }),
        ],
        target: "map",
        view,
      });

      //   addInteraction(map);
      initAreas(map);
      // map.on("click", (e) => {
      //   console.log(e.coordinate);
      // });

      return map;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  function zoomInto(x, y) {
    try {
      view.animate({
        center: [x, y],
        zoom: 3,
        duration: 1500,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

init();

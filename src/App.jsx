import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { getLanguages, translateText } from "./redux/translateAction";
import Select from "react-select";
import { setTranslated } from "./redux/translateSlice";

const App = () => {
  const dispatch = useDispatch();
  const state = useSelector((store) => store.translate);

  const [text, setText] = useState("")
  const [sourceLang, setSourceLang] = useState({
    label: "Turkish",
    value: "tr",
  });
  const [targetLang, setTargetLang] = useState({
    label: "English",
    value: "en",
  });


  // dil verilerini alır ve store'a aktarır
  useEffect(() => {
    dispatch(getLanguages());
  }, []);

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  // api'den gelen dizi içerisindeki {code ve name} değerlerine sahip objeleri
  // {label ve value} değerlerine sahip objelere çevirme (label kullanıcının gördüğü, value: seçtiği zaman state'a aktarılcak)
  // bir diziden yeni bir dizi dedik mi hep map gelmeli
  // state.laguages apiden gelen, refinedData ise bizim react select kütüphanesinin istediğine uygun olsun diye çevirdiğimiz veri
  // ancak buradaki top-level code olduğu için bileşenher render edildiğinde tekrardan çalışır
  // dolayısıyla her renderda 111 dili yeniden maplıyo
  // olması gereken bir kere maplamasi ve her seferinde hatırlaması bunu da usememo ile yapıyoz, her tuş vurusunda ve select değişiminde yüzlerce kez hesaplama yapılmasının önüne geçiyoruz
  // *usememo bağımlılık dizisi ister, sadece apiden gelen cevap değişince usememo tekrardan hesaplama yapsın yoksa seçtiğimiz dil değişince textareaya yazı yazınca hesaplama yapmasına gerek yok, consolun yanında console'da reduxin yanında component var memoya alınmış bileşenleri bulabilirsiniz
  const refinedData = useMemo(
    () =>
      state.languages.map((lang) => ({
        label: lang.name,
        value: lang.code,
      })),
    [state.languages]
  );

  const handleSwap = () => {
    setTargetLang(sourceLang);
    setSourceLang(targetLang);

    // alt inputtaki veriyi üsttekini aktar
    setText(state.translatedText);

    // üst inputtaki veriyi alt takine yani store'a aktar
    dispatch(setTranslated(text));
  };

  return (
    <div id="main-page">
      <div className="container">
        <h1>Translator +</h1>
        {/* top */}
        <div className="upper">
          {/* onchance setsourcelangı çalıştırır eventi oraya gönderir bu yeni kullanım
          daha önce onchange={(e)=> setSourceLang(e)} yapıyoduk*/}
          <Select
            onChange={setSourceLang}
            className="select"
            options={refinedData}
            value={sourceLang}
          />
          <button onClick={handleSwap}
            style={{ paddingTop: "0px", paddingBottom: "0px" }}
            className="icon"
          >
            <img width={40} src="arrowbutton.png" />
          </button>
          <Select
            className="select"
            onChange={setTargetLang}
            isLoading={state.isLangsLoading}
            //veri yüklenirken select açılmasın demek bu
            isDisabled={state.isLangsLoading}
            options={refinedData}
            value={targetLang}
          />
        </div>

        {/* middle */}
        <div className="middle">
          <div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div>
            {state.isTranslateLoading && (
              <ul class="wave-menu">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            )}
            <textarea value={state.translatedText} disabled />
          </div>
        </div>

        {/* bottom */}
        <button onClick={() => dispatch(translateText({ sourceLang, targetLang, text }))}>Translate</button>
      </div>
    </div>
  );
}

export default App;

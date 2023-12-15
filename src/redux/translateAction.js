import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { options } from ".././constants/index";

export const getLanguages = createAsyncThunk(
  "translate/getLanguages",
  async () => {
    // API isteği atar
    // options kısmında metotun get olduğu belli olduğu için burada get yazmak yerine request de yazabilirim
    // url de options'un içinde
    const res = await axios.request(options);
    // return etme

    return res.data.data.languages;
    // data.data olduğunu nerden anladık? Axios bütün res'lara bir katman data koyuyo,
    // ardından gelen cevapta da bir tane data vardı o yüzden iki tane koymak zorunda kaldık.
  }
);

export const translateText = createAsyncThunk(
  "translate/text",
  //async tek veri alabiliyormuş bu yüzden veriyi {}ekledik yani obje yaptık gönderdik
  //propslar bileşenlerde olur bu bir bileşen değil 

  async ({ sourceLang, targetLang, text }) => {
    // console.log(sourceLang,targetLang,text)
    // API isteği
    const params = new URLSearchParams();
    params.set("source_language", sourceLang.value);
    params.set("target_language", targetLang.value);
    params.set("text", text);
    console.log(params);

    //aşağıdaki yapıyı kuruyor bu, bunu aşağıdaki şekilde yazıp dinamikleştirip elle de yazabiliriz
    //"?source_language=en&target_language=tr&text=what is your name";

    const options = {
      method: "POST",
      url: "https://text-translator2.p.rapidapi.com/translate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "9e3aa64bb5msh539aa13f31eb687p15bd32jsne1db6cb4fd9e",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      data: params,
    };

    //yukardaki ayarlara göre api isteği atar
    const res = await axios.request(options);
    console.log(res);

    // cevabı slice'a aktar
    return res.data.data.translatedText
  }
);

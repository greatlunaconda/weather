import { getPlacesFromCookie, savePlacesToCookie, PlaceData, getLanguage, Language } from "../lib/cookies"
//import PlaceSelector from "../ui/place-selector";
import PlaceTable from "../ui/placetable";
import LeafletPlaceSelector from "../ui/leaflet-place-selector";
import Showcurrent from "../ui/showcurrent";
import Link from "next/link";
import { LangProp } from "../page";

const translations: { [language: string]: { [key: string]: string } } = {
  en: {
    save: 'Save',
    cancel: 'Cancel',
    open_map: 'Open map',
    name: 'NAME',
    lat: 'LATITUDE',
    lgn: 'LONGITUDE', 
    up: 'UP',
    down: 'DOWN',
    delete: 'Delete', 
    btow: 'Back to Weather',
    edit: 'Edit',
    p1: 'Default: Name of the nearest observation station',
    p2: 'Save or edit the currently indicated place name',
    p3: 'The place name currently being referred to',
    add_place: 'Add Place'
  },
  ja: {
    save: '保存',
    cancel: 'キャンセル',
    open_map: '地図を開く',
    name: '地名',
    lat: '緯度',
    lgn: '経度',
    up: '上へ',
    down: '下へ',
    delete: '削除',
    btow: '気象情報に戻る',
    edit: '編集',
    p1: 'デフォルト　最寄りの観測地の地名',
    p2: '現在地を保存または編集',
    p3: '現在指している地名',
    add_place: '場所を追加'
  },
  zh_cn: {
    save: '保存',
    cancel: '取消',
    open_map: '打开地图',
    name: '地名',
    lat: '纬度',
    lgn: '经度',
    up: '上移',
    down: '下移',
    delete: '删除',
    btow: '返回天气信息',
    edit: '编辑',
    p1: '默认：最近气象观测站的名称',
    p2: '保存或编辑当前指示的地名',
    p3: '当前所指的地名',
    add_place: '添加地点'
  },
  ru: {
    save: 'Сохранить',
    cancel: 'Отмена',
    open_map: 'Открыть карту',
    name: 'Название',
    lat: 'Широта',
    lgn: 'Долгота',
    up: 'Вверх',
    down: 'Вниз',
    delete: 'Удалить',
    btow: 'Назад к погоде',
    edit: 'Редактировать',
    p1: 'По умолчанию: Название ближайшей метеостанции',
    p2: 'Сохранить или изменить название текущего места',
    p3: 'Название места, на которое сейчас указывает маркер',
    add_place: 'Добавить место'
  },
  es: {
    save: 'Guardar',
    cancel: 'Cancelar',
    open_map: 'Abrir mapa',
    name: 'Nombre',
    lat: 'Latitud',
    lgn: 'Longitud',
    up: 'Subir',
    down: 'Bajar',
    delete: 'Eliminar',
    btow: 'Volver al clima',
    edit: 'Editar',
    p1: 'Por defecto: Nombre de la estación meteorológica más cercana',
    p2: 'Guardar o editar el nombre del lugar indicado actualmente',
    p3: 'El nombre del lugar al que se hace referencia actualmente',
    add_place: 'Añadir lugar'
  },
  fr: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    open_map: 'Ouvrir la carte',
    name: 'Nom',
    lat: 'Latitude',
    lgn: 'Longitude',
    up: 'Monter',
    down: 'Descendre',
    delete: 'Supprimer',
    btow: 'Retour à la météo',
    edit: 'Modifier',
    p1: 'Par défaut : Nom de la station météorologique la plus proche',
    p2: 'Enregistrer ou modifier le nom du lieu actuellement indiqué',
    p3: 'Le nom du lieu actuellement référencé',
    add_place: 'Ajouter un lieu'
  },
  ar: {
    save: 'حفظ',
    cancel: 'إلغاء',
    open_map: 'فتح الخريطة',
    name: 'اسم المكان',
    lat: 'خط العرض',
    lgn: 'خط الطول',
    up: 'لأعلى',
    down: 'لأسفل',
    delete: 'حذف',
    btow: 'العودة إلى الطقس',
    edit: 'تعديل',
    p1: 'افتراضي: اسم أقرب محطة رصد جوي',
    p2: 'حفظ أو تعديل اسم المكان المشار إليه حالياً',
    p3: 'اسم المكان الذي تتم الإشارة إليه حالياً',
    add_place: 'إضافة مكان'
  }
}


export default async function selectPlace() {
  const currentplaces = await getPlacesFromCookie();
  const language = await getLanguage();
  const lang:LangProp = [language, translations[language]];

  return (
    <>
    <div>
      <button className="bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-[25%] rounded">
         <Link href="/">Back to Weather</Link>
      </button>

    </div>
    <div>
      < Showcurrent />
    </div>
    <div>
       < PlaceTable   places={currentplaces} onSave={savePlacesToCookie}  lang={lang}/> 
 ,    </div>
    </>
 )
}

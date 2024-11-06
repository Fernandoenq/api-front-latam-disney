import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import InputMask from 'react-input-mask';
import BASE_URL from '../config';
import '../index.css';

const Cadastro = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false); //para abreir a modal
  const [isCadastroFeito, setIsCadastroFeito] = useState(false); // Estado para controlar se o cadastro foi feito
  const [isCadastro, setIsCadastro] = useState(true); // Estado para controlar se o cadastro foi feito
  
  const [message, setMessage] = useState(''); // Estado para a mensagem de erro ou sucesso
  const [isSuccess, setIsSuccess] = useState(false); // Para saber se foi sucesso ou erro
  const [aceiteTermoLGPD, setAceiteTermoLGPD] = useState(false);
  const [aceiteOfertas, setAceiteOfertas] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const options = {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  
  // Formatar a data e hora no fuso horário de São Paulo
  const dateInSaoPaulo = new Intl.DateTimeFormat('pt-BR', options).format(new Date());
  
  // Extrair e montar manualmente a data em formato ISO
  const [datePart, timePart] = dateInSaoPaulo.split(', ');
  const [day, month, year] = datePart.split('/');
  const [hour, minute, second] = timePart.split(':');
  
  // Criar uma string ISO sem conversão de fuso horário
  const formattedDate = `${year}-${month}-${day}T${hour}:${minute}:${second}-03:00`; // UTC-3 para São Paulo
  
  // console.log(formattedDate);
  

  const countries = [
    { value: 'AF', label: 'Afeganistão', flag: 'https://flagcdn.com/af.svg' },
    { value: 'AL', label: 'Albânia', flag: 'https://flagcdn.com/al.svg' },
    { value: 'DZ', label: 'Argélia', flag: 'https://flagcdn.com/dz.svg' },
    { value: 'AS', label: 'Samoa Americana', flag: 'https://flagcdn.com/as.svg' },
    { value: 'AD', label: 'Andorra', flag: 'https://flagcdn.com/ad.svg' },
    { value: 'AO', label: 'Angola', flag: 'https://flagcdn.com/ao.svg' },
    { value: 'AI', label: 'Anguilla', flag: 'https://flagcdn.com/ai.svg' },
    { value: 'AQ', label: 'Antártida', flag: 'https://flagcdn.com/aq.svg' },
    { value: 'AG', label: 'Antígua e Barbuda', flag: 'https://flagcdn.com/ag.svg' },
    { value: 'AR', label: 'Argentina', flag: 'https://flagcdn.com/ar.svg' },
    { value: 'AM', label: 'Armênia', flag: 'https://flagcdn.com/am.svg' },
    { value: 'AW', label: 'Aruba', flag: 'https://flagcdn.com/aw.svg' },
    { value: 'AU', label: 'Austrália', flag: 'https://flagcdn.com/au.svg' },
    { value: 'AT', label: 'Áustria', flag: 'https://flagcdn.com/at.svg' },
    { value: 'AZ', label: 'Azerbaijão', flag: 'https://flagcdn.com/az.svg' },
    { value: 'BS', label: 'Bahamas', flag: 'https://flagcdn.com/bs.svg' },
    { value: 'BH', label: 'Bahrein', flag: 'https://flagcdn.com/bh.svg' },
    { value: 'BD', label: 'Bangladesh', flag: 'https://flagcdn.com/bd.svg' },
    { value: 'BB', label: 'Barbados', flag: 'https://flagcdn.com/bb.svg' },
    { value: 'BY', label: 'Bielorrússia', flag: 'https://flagcdn.com/by.svg' },
    { value: 'BE', label: 'Bélgica', flag: 'https://flagcdn.com/be.svg' },
    { value: 'BZ', label: 'Belize', flag: 'https://flagcdn.com/bz.svg' },
    { value: 'BJ', label: 'Benin', flag: 'https://flagcdn.com/bj.svg' },
    { value: 'BM', label: 'Bermudas', flag: 'https://flagcdn.com/bm.svg' },
    { value: 'BT', label: 'Butão', flag: 'https://flagcdn.com/bt.svg' },
    { value: 'BO', label: 'Bolívia', flag: 'https://flagcdn.com/bo.svg' },
    { value: 'BQ', label: 'Bonaire, Sint Eustatius e Saba', flag: 'https://flagcdn.com/bq.svg' },
    { value: 'BA', label: 'Bósnia e Herzegovina', flag: 'https://flagcdn.com/ba.svg' },
    { value: 'BW', label: 'Botsuana', flag: 'https://flagcdn.com/bw.svg' },
    { value: 'BV', label: 'Ilha Bouvet', flag: 'https://flagcdn.com/bv.svg' },
    { value: 'BR', label: 'Brasil', flag: 'https://flagcdn.com/br.svg' },
    { value: 'IO', label: 'Território Britânico do Oceano Índico', flag: 'https://flagcdn.com/io.svg' },
    { value: 'BN', label: 'Brunéi', flag: 'https://flagcdn.com/bn.svg' },
    { value: 'BG', label: 'Bulgária', flag: 'https://flagcdn.com/bg.svg' },
    { value: 'BF', label: 'Burquina Faso', flag: 'https://flagcdn.com/bf.svg' },
    { value: 'BI', label: 'Burundi', flag: 'https://flagcdn.com/bi.svg' },
    { value: 'CV', label: 'Cabo Verde', flag: 'https://flagcdn.com/cv.svg' },
    { value: 'KH', label: 'Camboja', flag: 'https://flagcdn.com/kh.svg' },
    { value: 'CM', label: 'Camarões', flag: 'https://flagcdn.com/cm.svg' },
    { value: 'CA', label: 'Canadá', flag: 'https://flagcdn.com/ca.svg' },
    { value: 'KY', label: 'Ilhas Cayman', flag: 'https://flagcdn.com/ky.svg' },
    { value: 'CF', label: 'República Centro-Africana', flag: 'https://flagcdn.com/cf.svg' },
    { value: 'TD', label: 'Chade', flag: 'https://flagcdn.com/td.svg' },
    { value: 'CL', label: 'Chile', flag: 'https://flagcdn.com/cl.svg' },
    { value: 'CN', label: 'China', flag: 'https://flagcdn.com/cn.svg' },
    { value: 'CX', label: 'Ilha Christmas', flag: 'https://flagcdn.com/cx.svg' },
    { value: 'CC', label: 'Ilhas Cocos', flag: 'https://flagcdn.com/cc.svg' },
    { value: 'CO', label: 'Colômbia', flag: 'https://flagcdn.com/co.svg' },
    { value: 'KM', label: 'Comores', flag: 'https://flagcdn.com/km.svg' },
    { value: 'CD', label: 'República Democrática do Congo', flag: 'https://flagcdn.com/cd.svg' },
    { value: 'CG', label: 'Congo', flag: 'https://flagcdn.com/cg.svg' },
    { value: 'CK', label: 'Ilhas Cook', flag: 'https://flagcdn.com/ck.svg' },
    { value: 'CR', label: 'Costa Rica', flag: 'https://flagcdn.com/cr.svg' },
    { value: 'HR', label: 'Croácia', flag: 'https://flagcdn.com/hr.svg' },
    { value: 'CU', label: 'Cuba', flag: 'https://flagcdn.com/cu.svg' },
    { value: 'CW', label: 'Curaçao', flag: 'https://flagcdn.com/cw.svg' },
    { value: 'CY', label: 'Chipre', flag: 'https://flagcdn.com/cy.svg' },
    { value: 'CZ', label: 'República Tcheca', flag: 'https://flagcdn.com/cz.svg' },
    { value: 'DK', label: 'Dinamarca', flag: 'https://flagcdn.com/dk.svg' },
    { value: 'DJ', label: 'Djibuti', flag: 'https://flagcdn.com/dj.svg' },
    { value: 'DM', label: 'República Dominicana', flag: 'https://flagcdn.com/dm.svg' },
    { value: 'DO', label: 'Dominica', flag: 'https://flagcdn.com/do.svg' },
    { value: 'EC', label: 'Equador', flag: 'https://flagcdn.com/ec.svg' },
    { value: 'EG', label: 'Egito', flag: 'https://flagcdn.com/eg.svg' },
    { value: 'SV', label: 'El Salvador', flag: 'https://flagcdn.com/sv.svg' },
    { value: 'GQ', label: 'Guiné Equatorial', flag: 'https://flagcdn.com/gq.svg' },
    { value: 'ER', label: 'Eritreia', flag: 'https://flagcdn.com/er.svg' },
    { value: 'EE', label: 'Estônia', flag: 'https://flagcdn.com/ee.svg' },
    { value: 'SZ', label: 'Eswatini', flag: 'https://flagcdn.com/sz.svg' },
    { value: 'ET', label: 'Etiópia', flag: 'https://flagcdn.com/et.svg' },
    { value: 'FJ', label: 'Fiji', flag: 'https://flagcdn.com/fj.svg' },
    { value: 'FI', label: 'Finlândia', flag: 'https://flagcdn.com/fi.svg' },
    { value: 'FR', label: 'França', flag: 'https://flagcdn.com/fr.svg' },
    { value: 'PF', label: 'Polinésia Francesa', flag: 'https://flagcdn.com/pf.svg' },
    { value: 'GA', label: 'Gabão', flag: 'https://flagcdn.com/ga.svg' },
    { value: 'GM', label: 'Gâmbia', flag: 'https://flagcdn.com/gm.svg' },
    { value: 'GE', label: 'Geórgia', flag: 'https://flagcdn.com/ge.svg' },
    { value: 'DE', label: 'Alemanha', flag: 'https://flagcdn.com/de.svg' },
    { value: 'GH', label: 'Gana', flag: 'https://flagcdn.com/gh.svg' },
    { value: 'GI', label: 'Gibraltar', flag: 'https://flagcdn.com/gi.svg' },
    { value: 'GR', label: 'Grécia', flag: 'https://flagcdn.com/gr.svg' },
    { value: 'GL', label: 'Groenlândia', flag: 'https://flagcdn.com/gl.svg' },
    { value: 'GD', label: 'Granada', flag: 'https://flagcdn.com/gd.svg' },
    { value: 'GP', label: 'Guadalupe', flag: 'https://flagcdn.com/gp.svg' },
    { value: 'GU', label: 'Guame', flag: 'https://flagcdn.com/gu.svg' },
    { value: 'GT', label: 'Guatemala', flag: 'https://flagcdn.com/gt.svg' },
    { value: 'GG', label: 'Guernsey', flag: 'https://flagcdn.com/gg.svg' },
    { value: 'GN', label: 'Guiné', flag: 'https://flagcdn.com/gn.svg' },
    { value: 'GW', label: 'Guiné-Bissau', flag: 'https://flagcdn.com/gw.svg' },
    { value: 'GY', label: 'Guiana', flag: 'https://flagcdn.com/gy.svg' },
    { value: 'HT', label: 'Haiti', flag: 'https://flagcdn.com/ht.svg' },
    { value: 'HM', label: 'Ilha Heard e Ilhas McDonald', flag: 'https://flagcdn.com/hm.svg' },
    { value: 'VA', label: 'Vaticano', flag: 'https://flagcdn.com/va.svg' },
    { value: 'HN', label: 'Honduras', flag: 'https://flagcdn.com/hn.svg' },
    { value: 'HK', label: 'Hong Kong', flag: 'https://flagcdn.com/hk.svg' },
    { value: 'HU', label: 'Hungria', flag: 'https://flagcdn.com/hu.svg' },
    { value: 'IS', label: 'Islândia', flag: 'https://flagcdn.com/is.svg' },
    { value: 'IN', label: 'Índia', flag: 'https://flagcdn.com/in.svg' },
    { value: 'ID', label: 'Indonésia', flag: 'https://flagcdn.com/id.svg' },
    { value: 'IR', label: 'Irã', flag: 'https://flagcdn.com/ir.svg' },
    { value: 'IQ', label: 'Iraque', flag: 'https://flagcdn.com/iq.svg' },
    { value: 'IE', label: 'Irlanda', flag: 'https://flagcdn.com/ie.svg' },
    { value: 'IM', label: 'Ilha de Man', flag: 'https://flagcdn.com/im.svg' },
    { value: 'IL', label: 'Israel', flag: 'https://flagcdn.com/il.svg' },
    { value: 'IT', label: 'Itália', flag: 'https://flagcdn.com/it.svg' },
    { value: 'CI', label: 'Costa do Marfim', flag: 'https://flagcdn.com/ci.svg' },
    { value: 'JM', label: 'Jamaica', flag: 'https://flagcdn.com/jm.svg' },
    { value: 'JP', label: 'Japão', flag: 'https://flagcdn.com/jp.svg' },
    { value: 'JE', label: 'Jersey', flag: 'https://flagcdn.com/je.svg' },
    { value: 'JO', label: 'Jordânia', flag: 'https://flagcdn.com/jo.svg' },
    { value: 'KZ', label: 'Cazaquistão', flag: 'https://flagcdn.com/kz.svg' },
    { value: 'KE', label: 'Quênia', flag: 'https://flagcdn.com/ke.svg' },
    { value: 'KI', label: 'Quiribati', flag: 'https://flagcdn.com/ki.svg' },
    { value: 'KP', label: 'Coreia do Norte', flag: 'https://flagcdn.com/kp.svg' },
    { value: 'KR', label: 'Coreia do Sul', flag: 'https://flagcdn.com/kr.svg' },
    { value: 'KW', label: 'Kuwait', flag: 'https://flagcdn.com/kw.svg' },
    { value: 'KG', label: 'Quirguistão', flag: 'https://flagcdn.com/kg.svg' },
    { value: 'LA', label: 'Laos', flag: 'https://flagcdn.com/la.svg' },
    { value: 'LV', label: 'Letônia', flag: 'https://flagcdn.com/lv.svg' },
    { value: 'LB', label: 'Líbano', flag: 'https://flagcdn.com/lb.svg' },
    { value: 'LS', label: 'Lesoto', flag: 'https://flagcdn.com/ls.svg' },
    { value: 'LR', label: 'Libéria', flag: 'https://flagcdn.com/lr.svg' },
    { value: 'LY', label: 'Líbia', flag: 'https://flagcdn.com/ly.svg' },
    { value: 'LI', label: 'Liechtenstein', flag: 'https://flagcdn.com/li.svg' },
    { value: 'LT', label: 'Lituânia', flag: 'https://flagcdn.com/lt.svg' },
    { value: 'LU', label: 'Luxemburgo', flag: 'https://flagcdn.com/lu.svg' },
    { value: 'MO', label: 'Macau', flag: 'https://flagcdn.com/mo.svg' },
    { value: 'MG', label: 'Madagascar', flag: 'https://flagcdn.com/mg.svg' },
    { value: 'MW', label: 'Malawi', flag: 'https://flagcdn.com/mw.svg' },
    { value: 'MY', label: 'Malásia', flag: 'https://flagcdn.com/my.svg' },
    { value: 'MV', label: 'Maldivas', flag: 'https://flagcdn.com/mv.svg' },
    { value: 'ML', label: 'Mali', flag: 'https://flagcdn.com/ml.svg' },
    { value: 'MT', label: 'Malta', flag: 'https://flagcdn.com/mt.svg' },
    { value: 'MH', label: 'Ilhas Marshall', flag: 'https://flagcdn.com/mh.svg' },
    { value: 'MQ', label: 'Martinica', flag: 'https://flagcdn.com/mq.svg' },
    { value: 'MR', label: 'Mauritânia', flag: 'https://flagcdn.com/mr.svg' },
    { value: 'MU', label: 'Maurício', flag: 'https://flagcdn.com/mu.svg' },
    { value: 'YT', label: 'Mayotte', flag: 'https://flagcdn.com/yt.svg' },
    { value: 'MX', label: 'México', flag: 'https://flagcdn.com/mx.svg' },
    { value: 'FM', label: 'Estados Federados da Micronésia', flag: 'https://flagcdn.com/fm.svg' },
    { value: 'MD', label: 'Moldávia', flag: 'https://flagcdn.com/md.svg' },
    { value: 'MC', label: 'Mônaco', flag: 'https://flagcdn.com/mc.svg' },
    { value: 'MN', label: 'Mongólia', flag: 'https://flagcdn.com/mn.svg' },
    { value: 'ME', label: 'Montenegro', flag: 'https://flagcdn.com/me.svg' },
    { value: 'MS', label: 'Montserrat', flag: 'https://flagcdn.com/ms.svg' },
    { value: 'MA', label: 'Marrocos', flag: 'https://flagcdn.com/ma.svg' },
    { value: 'MZ', label: 'Moçambique', flag: 'https://flagcdn.com/mz.svg' },
    { value: 'MM', label: 'Mianmar', flag: 'https://flagcdn.com/mm.svg' },
    { value: 'NA', label: 'Namíbia', flag: 'https://flagcdn.com/na.svg' },
    { value: 'NR', label: 'Nauru', flag: 'https://flagcdn.com/nr.svg' },
    { value: 'NP', label: 'Nepal', flag: 'https://flagcdn.com/np.svg' },
    { value: 'NL', label: 'Países Baixos', flag: 'https://flagcdn.com/nl.svg' },
    { value: 'NZ', label: 'Nova Zelândia', flag: 'https://flagcdn.com/nz.svg' },
    { value: 'NI', label: 'Nicarágua', flag: 'https://flagcdn.com/ni.svg' },
    { value: 'NE', label: 'Níger', flag: 'https://flagcdn.com/ne.svg' },
    { value: 'NG', label: 'Nigéria', flag: 'https://flagcdn.com/ng.svg' },
    { value: 'NU', label: 'Niue', flag: 'https://flagcdn.com/nu.svg' },
    { value: 'NF', label: 'Ilha Norfolk', flag: 'https://flagcdn.com/nf.svg' },
    { value: 'MP', label: 'Ilhas Marianas do Norte', flag: 'https://flagcdn.com/mp.svg' },
    { value: 'NO', label: 'Noruega', flag: 'https://flagcdn.com/no.svg' },
    { value: 'OM', label: 'Omã', flag: 'https://flagcdn.com/om.svg' },
    { value: 'PK', label: 'Paquistão', flag: 'https://flagcdn.com/pk.svg' },
    { value: 'PW', label: 'Palau', flag: 'https://flagcdn.com/pw.svg' },
    { value: 'PS', label: 'Palestina', flag: 'https://flagcdn.com/ps.svg' },
    { value: 'PA', label: 'Panamá', flag: 'https://flagcdn.com/pa.svg' },
    { value: 'PG', label: 'Papua Nova Guiné', flag: 'https://flagcdn.com/pg.svg' },
    { value: 'PY', label: 'Paraguai', flag: 'https://flagcdn.com/py.svg' },
    { value: 'PE', label: 'Peru', flag: 'https://flagcdn.com/pe.svg' },
    { value: 'PH', label: 'Filipinas', flag: 'https://flagcdn.com/ph.svg' },
    { value: 'PN', label: 'Ilhas Pitcairn', flag: 'https://flagcdn.com/pn.svg' },
    { value: 'PT', label: 'Portugal', flag: 'https://flagcdn.com/pt.svg' },
    { value: 'PR', label: 'Porto Rico', flag: 'https://flagcdn.com/pr.svg' },
    { value: 'QA', label: 'Catar', flag: 'https://flagcdn.com/qa.svg' },
    { value: 'RE', label: 'Reunião', flag: 'https://flagcdn.com/re.svg' },
    { value: 'RO', label: 'Romênia', flag: 'https://flagcdn.com/ro.svg' },
    { value: 'RU', label: 'Rússia', flag: 'https://flagcdn.com/ru.svg' },
    { value: 'RW', label: 'Ruanda', flag: 'https://flagcdn.com/rw.svg' },
    { value: 'BL', label: 'São Bartolomeu', flag: 'https://flagcdn.com/bl.svg' },
    { value: 'SH', label: 'Santa Helena', flag: 'https://flagcdn.com/sh.svg' },
    { value: 'KN', label: 'São Cristóvão e Nevis', flag: 'https://flagcdn.com/kn.svg' },
    { value: 'LC', label: 'Santa Lúcia', flag: 'https://flagcdn.com/lc.svg' },
    { value: 'MF', label: 'São Martinho', flag: 'https://flagcdn.com/mf.svg' },
    { value: 'PM', label: 'São Pedro e Miquelão', flag: 'https://flagcdn.com/pm.svg' },
    { value: 'VC', label: 'São Vicente e Granadinas', flag: 'https://flagcdn.com/vc.svg' },
    { value: 'WS', label: 'Samoa', flag: 'https://flagcdn.com/ws.svg' },
    { value: 'SM', label: 'San Marino', flag: 'https://flagcdn.com/sm.svg' },
    { value: 'ST', label: 'São Tomé e Príncipe', flag: 'https://flagcdn.com/st.svg' },
    { value: 'RS', label: 'Sérvia', flag: 'https://flagcdn.com/rs.svg' },
    { value: 'SC', label: 'Seicheles', flag: 'https://flagcdn.com/sc.svg' },
    { value: 'SL', label: 'Serra Leoa', flag: 'https://flagcdn.com/sl.svg' },
    { value: 'SG', label: 'Singapura', flag: 'https://flagcdn.com/sg.svg' },
    { value: 'SX', label: 'Sint Maarten', flag: 'https://flagcdn.com/sx.svg' },
    { value: 'SK', label: 'Eslováquia', flag: 'https://flagcdn.com/sk.svg' },
    { value: 'SI', label: 'Eslovênia', flag: 'https://flagcdn.com/si.svg' },
    { value: 'SB', label: 'Ilhas Salomão', flag: 'https://flagcdn.com/sb.svg' },
    { value: 'SO', label: 'Somália', flag: 'https://flagcdn.com/so.svg' },
    { value: 'ZA', label: 'África do Sul', flag: 'https://flagcdn.com/za.svg' },
    { value: 'SS', label: 'Sudão do Sul', flag: 'https://flagcdn.com/ss.svg' },
    { value: 'ES', label: 'Espanha', flag: 'https://flagcdn.com/es.svg' },
    { value: 'LK', label: 'Sri Lanka', flag: 'https://flagcdn.com/lk.svg' },
    { value: 'SD', label: 'Sudão', flag: 'https://flagcdn.com/sd.svg' },
    { value: 'SR', label: 'Suriname', flag: 'https://flagcdn.com/sr.svg' },
    { value: 'SZ', label: 'Suazilândia', flag: 'https://flagcdn.com/sz.svg' },
    { value: 'SE', label: 'Suécia', flag: 'https://flagcdn.com/se.svg' },
    { value: 'CH', label: 'Suíça', flag: 'https://flagcdn.com/ch.svg' },
    { value: 'SY', label: 'Síria', flag: 'https://flagcdn.com/sy.svg' },
    { value: 'TJ', label: 'Tajiquistão', flag: 'https://flagcdn.com/tj.svg' },
    { value: 'TZ', label: 'Tanzânia', flag: 'https://flagcdn.com/tz.svg' },
    { value: 'TH', label: 'Tailândia', flag: 'https://flagcdn.com/th.svg' },
    { value: 'TG', label: 'Togo', flag: 'https://flagcdn.com/tg.svg' },
    { value: 'TK', label: 'Tokelau', flag: 'https://flagcdn.com/tk.svg' },
    { value: 'TO', label: 'Tonga', flag: 'https://flagcdn.com/to.svg' },
    { value: 'TT', label: 'Trinidad e Tobago', flag: 'https://flagcdn.com/tt.svg' },
    { value: 'TN', label: 'Tunísia', flag: 'https://flagcdn.com/tn.svg' },
    { value: 'TR', label: 'Turquia', flag: 'https://flagcdn.com/tr.svg' },
    { value: 'TM', label: 'Turcomenistão', flag: 'https://flagcdn.com/tm.svg' },
    { value: 'TC', label: 'Ilhas Turcas e Caicos', flag: 'https://flagcdn.com/tc.svg' },
    { value: 'TV', label: 'Tuvalu', flag: 'https://flagcdn.com/tv.svg' },
    { value: 'UG', label: 'Uganda', flag: 'https://flagcdn.com/ug.svg' },
    { value: 'UA', label: 'Ucrânia', flag: 'https://flagcdn.com/ua.svg' },
    { value: 'AE', label: 'Emirados Árabes Unidos', flag: 'https://flagcdn.com/ae.svg' },
    { value: 'GB', label: 'Reino Unido', flag: 'https://flagcdn.com/gb.svg' },
    { value: 'US', label: 'Estados Unidos', flag: 'https://flagcdn.com/us.svg' },
    { value: 'UY', label: 'Uruguai', flag: 'https://flagcdn.com/uy.svg' },
    { value: 'UZ', label: 'Uzbequistão', flag: 'https://flagcdn.com/uz.svg' },
    { value: 'VU', label: 'Vanuatu', flag: 'https://flagcdn.com/vu.svg' },
    { value: 'VE', label: 'Venezuela', flag: 'https://flagcdn.com/ve.svg' },
    { value: 'VN', label: 'Vietnã', flag: 'https://flagcdn.com/vn.svg' },
    { value: 'WF', label: 'Wallis e Futuna', flag: 'https://flagcdn.com/wf.svg' },
    { value: 'EH', label: 'Saara Ocidental', flag: 'https://flagcdn.com/eh.svg' },
    { value: 'YE', label: 'Iémen', flag: 'https://flagcdn.com/ye.svg' },
    { value: 'ZM', label: 'Zâmbia', flag: 'https://flagcdn.com/zm.svg' },
    { value: 'ZW', label: 'Zimbábue', flag: 'https://flagcdn.com/zw.svg' },
  ];
  
  
  
  const [selectedCountry, setSelectedCountry] = useState(countries[30]); // Inicializa com Brasil
  
  const handleChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setCelular(''); // Limpa o campo de celular ao mudar de país
    setError(''); // Limpa o erro ao mudar de país
  };

  const customStyles = {
    option: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
    singleValue: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
  };

  const formatOptionLabel = ({ label, flag }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={flag} alt="" style={{ width: 20, height: 15, marginRight: 10 }} />
      {label}
    </div>
  );
 
  

  // Função para formatar o CPF
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o primeiro ponto
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o segundo ponto
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o hífen
    setCpf(value);
  };

  // Função para validar CPF (simplesmente verifica o número de dígitos)
  const isValidCpf = (cpf) => {
    const cpfDigits = cpf.replace(/\D/g, ''); // Remove os caracteres especiais
    return cpfDigits.length === 11; // Verifica se tem 11 dígitos
  };

  
  const handlePhoneChange = (e) => {
    setCelular(e.target.value);
    if (error) setError(''); // Limpa o erro enquanto o usuário está digitando
    
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    // console.log(selectedCountry);
  const cleanedPhone = celular.replace(/\D/g, ''); // Remove tudo que não é dígito

    // Validar se o CPF é válido
    if (!isValidCpf(cpf)) {
      setMessage("CPF inválido! Verifique o número e tente novamente.");
      return;
    }
    // console.log("esse e o pais",selectedCountry.label)
    // console.log("?",aceiteTermoLGPD)
    // console.log("?",aceiteOfertas)
    // console.log("cel",cleanedPhone)
   

    // Preparar os dados do cliente para o cadastro
    const clientData = {
      RegisterDate: formattedDate,
      PersonName: name,
      Cpf: cpf.replace(/\D/g, ''), // Remove a formatação do CPF antes de enviar
      Phone: cleanedPhone, // Usar o número do celular limpo
      BirthDate: 1,
      Mail: email,
      CountryName:selectedCountry.label.toString(),
      HasAcceptedParticipation: aceiteTermoLGPD, // Use o estado do rádio
      HasAcceptedPromotion: aceiteOfertas // Use o estado do rádio
    };
    // console.log(clientData)

    try {
      // Verifica se o Termo LGPD foi aceito
        if (!aceiteTermoLGPD) {
          setMessage('Você deve aceitar o Termo LGPD para continuar.');
          return; // Impede o envio dos dados se o termo não for aceito
        }
      // Enviar os dados via POST para o endpoint
      const response = await fetch(`${BASE_URL}/Person/Person`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      // Pegar os dados retornados pela resposta do backend
      const data = await response.json();

      if (response.ok) {
        // Cadastro bem-sucedido, você pode realizar ações aqui
        setIsSuccess(true);
        setMessage("Cadastro realizado com sucesso!");
        setIsModalOpen(true);
        setIsCadastroFeito(true);
        setIsCadastro(false);
        localStorage.setItem('cpf', cpf); // Armazenando o CPF no localStorage
        localStorage.setItem('personId', data.PersonId);
        // console.log(cpf);
       
      } else if (response.status === 422) {
        // Erro de validação (422 Unprocessable Entity) vindo do backend
        setIsSuccess(false);
        const errors = data.Errors ? data.Errors.join(', ') : 'Erro desconhecido';
        setMessage(`Erro no cadastro: ${errors}`);
       
      } else {
        // Outros tipos de erros (400, 500, etc.)
        setIsSuccess(false);
        setMessage('Erro no cadastro. Tente novamente.');
       
      }
    } catch (error) {
      // Caso ocorra um erro na requisição
      setIsSuccess(false);
      setMessage(`Erro na comunicação com o servidor: ${error.message}`);
      
    }
  };

  //fechando a modal
  const closeModal = () => {
    setIsModalOpen(false);
  };


  const handleTermoLGPDChange = (e) => {
    setAceiteTermoLGPD(prev => !prev);
  };

  const handleOfertasChange = (e) => {
     setAceiteOfertas(prev => !prev);
  };

  const handleBlur = () => {
    // Valida o número de telefone apenas quando o usuário termina de digitar
    if (selectedCountry.value === 'BR' && celular.replace(/[^0-9]/g, '').length < 11) {
      setError('Número de telefone inválido. Exemplo: (99) 99999-9999');
    } else {
      setError('');
    }
  };
 

  return (
    <div className="flex flex-col min-h-screen items-center body-cad" 
    style={{ backgroundImage: `url('/novomenu.png')`, backgroundSize: 'cover',
    // border: 'solid red 1px' 
    }}>
      
       <div
          className="img tabletModelo-destino geral-cadastro"
          style={{
            height: '24vh',
            width: '90vw',
            backgroundImage: 'url(destinos.png)',
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            marginTop:'0px',
            border:'solid yellow 1px'
          }}
        ></div>
      
      <div className="p-6 rounded-lg shadow-md w-full max-w-[900px] mx-auto"
       style={{ 
        border:'solid red 1px',
       }}
       >
       
      


        {/* Formulário que pega email e senha */}
        <form onSubmit={handleCadastro} className="space-y-4">


        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 gap-x-20 w-full max-w-screen-lg ">
                  <div >
                    <input
                      type="name"
                      placeholder="Nome Completo"
                      className="w-full shadow-x8 pl-12 pr-4 py-2  text-white  rounded-[20px] cadastro-input"
                      style={{ backgroundColor: 'rgba(65, 105, 225, 0.3)', // Cor de fundo com opacidade (0.6, ajustável), 
                        height: '55px',  boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
                        borderBottom: '3px solid black' }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full shadow-x8 pl-12 pr-4 py-2  text-white  rounded-[20px] cadastro-input"
                      style={{ backgroundColor: 'rgba(65, 105, 225, 0.3)', // Cor de fundo com opacidade (0.6, ajustável), 
                        height: '55px',  boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
                        borderBottom: '3px solid black'}}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <input
                      type="cpf"
                      placeholder="CPF"
                      className="w-full shadow-x8 pl-12 pr-4 py-2  text-white  rounded-[20px] cadastro-input"
                      style={{ backgroundColor: 'rgba(65, 105, 225, 0.3)', // Cor de fundo com opacidade (0.6, ajustável), 
                        height: '55px',  boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
                        borderBottom: '3px solid black'}}
                      value={cpf}
                      onChange={(e) => {
                        setCpf(e.target.value);
                        handleCpfChange(e);
                      }}
                      required
                    />
                  </div>
                  <div>
                      <InputMask
                              mask={selectedCountry.value === 'BR' ? '(99) 99999-9999' : ''}
                              placeholder="Celular/WhatsApp"
                              className={`w-full shadow-x8 pl-12 pr-4 py-2 text-white rounded-[20px] cadastro-input ${error ? 'border-red-500' : ''}`}
                              style={{
                                backgroundColor: 'rgba(65, 105, 225, 0.3)',
                                height: '55px',
                                boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
                                borderBottom: '3px solid black'
                              }}
                              value={celular}
                              onChange={handlePhoneChange}
                              onBlur={handleBlur} // Validação ao sair do campo
                              required
                            />
                            {error && <p className="text-red-500">{error}</p>} {/* Mensagem de erro */}
                    </div>




                  <div>
                      <Select
                      className='cadastro-input'
                        value={selectedCountry}
                        onChange={handleChange}
                        options={countries}
                        formatOptionLabel={formatOptionLabel}
                        styles={{
                          ...customStyles,
                          control: (base) => ({
                            ...base,
                            width: '100%', // Garantindo que o controle ocupe toda a largura
                            height: '55px', // Definindo a altura
                            backgroundColor: 'rgba(65, 105, 225, 0.3)', // Cor de fundo com opacidade
                            boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)', // Sombra
                            borderBottom: '3px solid black', // Borda inferior
                            border: 'none', // Remover bordas padrão
                            borderRadius: '20px', // Bordas arredondadas
                            paddingLeft: '3rem', // Para compensar o padding interno
                            paddingRight: '1rem', // Para compensar o padding interno
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: 'white', // Cor do texto
                          }),
                          dropdownIndicator: (base) => ({
                            ...base,
                            color: 'white', // Cor do ícone do dropdown
                          }),
                          indicatorSeparator: () => ({
                            display: 'none', // Remover o separador do indicador
                          }),
                        }}
                        required
                      />
                    </div>




          </div>

          <div className="flex flex-col  p-1">
                      <p className="text-white text-cadastro mb-4 ">
                        Os dados pessoais coletados em razão deste evento serão tratados em total conformidade com a Lei Federal nº 13.709/2018 (Lei Geral de Proteção de Dados).
                      </p>

                      <div className="flex text-sm gap-8">
                        <label className="text-white flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={aceiteTermoLGPD}
                            onChange={handleTermoLGPDChange}
                            className="custom-radio"
                          />
                          <span>Aceite ao Termo LGPD</span>
                        </label>
                        
                        <label className="text-white flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={aceiteOfertas}
                            onChange={handleOfertasChange}
                            className="custom-radio"
                          />
                          <span>Aceite em receber ofertas</span>
                        </label>
                      </div>
            </div>


            <div className="flex flex-col md:flex-row justify-between items-center " style={{
              // border: 'solid red 1px'
              }}> {/* flex-col para mobile e flex-row para telas médias em diante */}
                   {/* Condicional para o botão de cadastro */}
              {isCadastro && (
                      <button
                        type="submit"
                        
                        className="w-[170px] h-[30px] cadastrar text-white text-xl font-bold  transition-colors rounded-[20px] flex justify-center items-center mb-2 md:mb-0 font-latam cadastro-btn" // mb-2 para espaçamento em mobile
                        style={{
                          boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
                          borderBottom: '3px solid black',
                        }}
                      >
                        Cadastrar
                      </button>
                  )}
                  <div className="flex justify-end"> {/* Mantém a flexibilidade para botões */}
                    <button
                    
                      className="w-[170px] h-[30px] voltar text-white text-xl font-bold  transition-colors rounded-[20px] flex justify-center items-center mr-2 font-latam" // mr-2 para espaçamento entre os botões
                      style={{
                        boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
                        borderBottom: '3px solid black',
                       
                      }}
                      onClick={() => navigate('/dashboard')}
                    >
                      Voltar
                    </button>

                    {/* Exibir após o cadastro */}
                    {isCadastroFeito && (
                    <button
                      className="agendar w-[170px] h-[40px] voltar text-white text-xl font-bold  transition-colors rounded-[20px] flex justify-center items-center font-latam"
                      style={{
                        boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
                        borderBottom: '3px solid black',
                      }}
                      onClick={() => navigate('/agendar', { state: { cpf } })} // Corrigido para passar o segundo argumento corretamente
                    >
                      Agendar
                    </button>
                     )} 
                  </div>
                </div>




        </form>

        {/* Exibição de mensagem de erro ou sucesso */}
        {message && (
          <div className={`mt-4 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </div>
        )}

        
       
       {/* Imagem colocada abaixo dos inputs e botões */}
          <div className="flex justify-center items-center"> {/* Container flex para centralizar */}
            <div
              className=" tabletModelo-assinatura "
              style={{
                height: '10vh',
                width: '20vw',
                backgroundImage: 'url(assinatura.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginTop:'10px'
              }}
            />
          </div>
      </div>

      {/* Modal de confirmação */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-xl  text-center mb-4 font-latam">Cadastro realizado com sucesso!</h2>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors font-latam"
              onClick={closeModal}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default Cadastro;

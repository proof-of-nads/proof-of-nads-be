import axios from 'axios';

// 유저 데이터 목록
const users = [
        { username: 'builnad', discord_id: 'builnad', wallet_address: '1' },
{ username: 'baeksu', discord_id: '.100su', wallet_address: '2' },
{ username: 'Jinie', discord_id: 'jin_bharvest', wallet_address: '3' },
{ username: 'PingPing', discord_id: 'pingpingpingpingping', wallet_address: '4' },
{ username: 'boba', discord_id: 'boba5000', wallet_address: '5' },
{ username: 'ozzy', discord_id: 'ozzyxbt', wallet_address: '6' },
{ username: 'berzan', discord_id: 'berzanorg', wallet_address: '7' },
{ username: 'mingming', discord_id: 'minhee8914', wallet_address: '8' },
{ username: 'Claire', discord_id: 'claire3653', wallet_address: '9' },
{ username: 'endgame', discord_id: 'endgame1', wallet_address: '10' },
{ username: 'buja', discord_id: 'buja723', wallet_address: '11' },
{ username: 'Grimjow', discord_id: '0xgrimjow', wallet_address: '12' },
{ username: 'BenjaNad', discord_id: 'benjamincrypto', wallet_address: '13' },
{ username: 'Ketama', discord_id: 'ketamah', wallet_address: '14' },
{ username: 'whitesocks', discord_id: 'whitesocks', wallet_address: '15' },
{ username: 'PaulC', discord_id: 'paulchoi', wallet_address: '16' },
{ username: 'juju5378', discord_id: 'juju5378', wallet_address: '17' },
{ username: 'Ssick', discord_id: 'ssick', wallet_address: '18' },
  { username: 'Keone', discord_id: 'keoneh', wallet_address: '19' },
  { username: 'overcome', discord_id: 'gegbok', wallet_address: '20' },
  { username: 'This is Fin', discord_id: 'thisisfin_', wallet_address: '21' },
  { username: 'momoflisa', discord_id: 'momoflisa', wallet_address: '22' },
  { username: 'Shuwski', discord_id: 'shuwski', wallet_address: '23' },
  { username: 'ShimMoney', discord_id: 'shimmoney', wallet_address: '24' },
  { username: 'HB', discord_id: 'hhbbb', wallet_address: '25' },
  { username: 'Lavadong', discord_id: 'lavalabva', wallet_address: '26' },
  { username: 'PolyMoly', discord_id: 'PolyMoly', wallet_address: '27' },
  { username: 'chamdom', discord_id: 'chamdom', wallet_address: '28' },
  { username: 'baram7', discord_id: 'baram7', wallet_address: '29' },
  { username: 'Choonsik', discord_id: 'Choonsik', wallet_address: '30' },
  { username: 'Jeongnam', discord_id: 'Jeongnam', wallet_address: '31' },
  { username: 'Seungjae', discord_id: 'Seungjae', wallet_address: '32' },
  { username: 'hojuun2', discord_id: 'hojuun2', wallet_address: '33' },
  { username: 'bakba', discord_id: 'bakba', wallet_address: '34' },
  { username: 'Blaker', discord_id: 'Blaker', wallet_address: '35' }
]

// 서버에 유저 데이터 전송 함수
const signupUser = async (user) => {
  try {
    const response = await axios.post('http://localhost:7777/api/auth/signup', {
      username: user.username,
      discord_id: user.discord_id,
      wallet_address: user.wallet_address,
    });
    console.log(`${user.username} 등록 성공!`, response.data);
  } catch (error) {
    console.error(`${user.username} 등록 실패:`, error.response ? error.response.data : error.message);
  }
};

// 모든 유저 데이터를 순차적으로 전송
const registerAllUsers = async () => {
  for (const user of users) {
    await signupUser(user);
  }
};

registerAllUsers();
import axios from 'axios';

// 유저와 연결 정보
const users = [
  { username: 'builnad', connections: { 2: ['Jinie', 'BenjaNad', 'Grimjow', 'baeksu', 'Ketama'], 3: ['whitesocks', 'baeksu', 'endgame', 'mingming'], 4: ['Jinie', 'PaulC', 'whitesocks', 'ShimMoney', 'baeksu'], 8: ['baeksu', 'mingming', 'Blaker', 'ShimMoney', 'bakba', 'Jinie'] } },
  { username: 'baeksu', connections: { 1: ['PingPing', 'mingming', 'boba', 'Shuwski', 'Claire', 'endgame', 'buja', 'berzan', 'ozzy'], 2: ['builnad', 'Jinie', 'BenjaNad', 'Grimjow', 'Ketama'], 3: ['builnad', 'whitesocks', 'endgame', 'mingming'], 4: ['builnad', 'Jinie', 'PaulC', 'whitesocks', 'ShimMoney'], 5: ['berzan', 'claire', 'momoflisa', 'BenjaNad', 'overcome', 'This is Fin'], 6: ['Ssick', 'juju5378', 'Keone'], 8: ['builnad', 'mingming', 'Blaker', 'ShimMoney', 'bakba', 'Jinie'] } },
  { username: 'Jinie', connections: { 2: ['builnad', 'BenjaNad', 'Grimjow', 'baeksu', 'Ketama'], 4: ['builnad', 'PaulC', 'whitesocks', 'ShimMoney', 'baeksu'], 8: ['builnad', 'baeksu', 'mingming', 'Blaker', 'ShimMoney', 'bakba'] } },
  { username: 'PingPing', connections: { 1: ['PingPing', 'mingming', 'boba', 'Shuwski', 'Claire', 'baeksu', 'endgame', 'buja', 'berzan', 'ozzy'] } },
  { username: 'boba', connections: { 1: ['PingPing', 'mingming', 'Shuwski', 'Claire', 'baeksu', 'endgame', 'buja', 'berzan', 'ozzy'] } },
  { username: 'ozzy', connections: { 1: ['PingPing', 'mingming', 'boba', 'Shuwski', 'Claire', 'baeksu', 'endgame', 'buja', 'berzan'] } },
  { username: 'berzan', connections: { 1: ['PingPing', 'mingming', 'boba', 'Shuwski', 'Claire', 'baeksu', 'endgame', 'buja', 'ozzy'], 5: ['claire', 'momoflisa', 'BenjaNad', 'baeksu', 'overcome', 'This is Fin'] } },
  { username: 'mingming', connections: { 1: ['PingPing', 'boba', 'Shuwski', 'Claire', 'baeksu', 'endgame', 'buja', 'berzan', 'ozzy'], 3: ['builnad', 'whitesocks', 'baeksu', 'endgame'], 8: ['builnad', 'baeksu', 'Blaker', 'ShimMoney', 'bakba', 'Jinie'] } },
  { username: 'Claire', connections: { 1: ['PingPing', 'mingming', 'boba', 'Shuwski', 'baeksu', 'endgame', 'buja', 'berzan', 'ozzy'], 5: ['berzan', 'momoflisa', 'BenjaNad', 'baeksu', 'overcome', 'This is Fin'], 7: ['HB', 'Lavadong', 'PolyMoly', 'whitesocks', 'chamdom', 'baram7', 'Choonsik', 'Jeongnam', 'Seungjae', 'hojuun2', 'overcome', 'ssick', 'endgame', 'buja', 'PaulC'] } },
  { username: 'endgame', connections: { 1: ['PingPing', 'mingming', 'boba', 'Shuwski', 'Claire', 'baeksu', 'buja', 'berzan', 'ozan'], 3: ['builnad', 'whitesocks', 'baeksu', 'mingming'], 7: ['HB', 'Lavadong', 'PolyMoly', 'whitesocks', 'chamdom', 'baram7', 'Choonsik', 'Jeongnam', 'Seungjae', 'hojuun2', 'overcome', 'ssick', 'buja', 'Claire', 'PaulC'] } },
  { username: 'buja', connections: { 1: ['PingPing', 'mingming', 'boba', 'Shuwski', 'Claire', 'baeksu', 'endgame', 'berzan', 'ozzy'], 7: ['HB', 'Lavadong', 'PolyMoly', 'whitesocks', 'chamdom', 'baram7', 'Choonsik', 'Jeongnam', 'Seungjae', 'hojuun2', 'overcome', 'ssick', 'endgame', 'Claire', 'PaulC'] } },
  { username: 'Grimjow', connections: { 2: ['builnad', 'Jinie', 'BenjaNad', 'baeksu', 'Ketama'] } },
  { username: 'BenjaNad', connections: { 2: ['builnad', 'Jinie', 'Grimjow', 'baeksu', 'Ketama'], 5: ['berzan', 'claire', 'momoflisa', 'baeksu', 'overcome', 'This is Fin'] } },
  { username: 'Ketama', connections: { 2: ['builnad', 'Jinie', 'BenjaNad', 'Grimjow', 'baeksu'] } },
  { username: 'whitesocks', connections: { 3: ['builnad', 'baeksu', 'endgame', 'mingming'], 4: ['builnad', 'Jinie', 'PaulC', 'ShimMoney', 'baeksu'], 7: ['HB', 'Lavadong', 'PolyMoly', 'chamdom', 'baram7', 'Choonsik', 'Jeongnam', 'Seungjae', 'hojuun2', 'overcome', 'ssick', 'endgame', 'buja', 'Claire', 'PaulC'] } },
  { username: 'PaulC', connections: { 4: ['builnad', 'Jinie', 'whitesocks', 'ShimMoney', 'baeksu'], 7: ['HB', 'Lavadong', 'PolyMoly', 'whitesocks', 'chamdom', 'baram7', 'Choonsik', 'Jeongnam', 'Seungjae', 'hojuun2', 'overcome', 'ssick', 'endgame', 'buja', 'Claire'] } },
  { username: 'juju5378', connections: { 6: ['baeksu', 'Ssick', 'Keone'] } },
  { username: 'Ssick', connections: { 6: ['baeksu', 'juju5378', 'Keone'], 7: ['HB', 'Lavadong', 'PolyMoly', 'whitesocks', 'chamdom', 'baram7', 'Choonsik', 'Jeongnam', 'Seungjae', 'hojuun2', 'overcome', 'endgame', 'buja', 'Claire', 'PaulC'] } },
  { username: 'Keone', connections: { 6: ['baeksu', 'Ssick', 'juju5378'] } },
  { username: 'overcome', connections: { 5: ['berzan', 'claire', 'momoflisa', 'BenjaNad', 'baeksu', 'This is Fin'], 7: ['HB', 'Lavadong', 'PolyMoly', 'whitesocks', 'chamdom', 'baram7', 'Choonsik', 'Jeongnam', 'Seungjae', 'hojuun2', 'ssick', 'endgame', 'buja', 'Claire', 'PaulC'] } },
  { username: 'This is Fin', connections: { 5: ['berzan', 'overcome', 'claire', 'momoflisa', 'BenjaNad', 'baeksu'] } },
  { username: 'momoflisa', connections: { 5: ['berzan', 'claire', 'This is Fin', 'BenjaNad', 'baeksu', 'overcome'] } },
  { username: 'Shuwski', connections: { 1: ['PingPing', 'mingming', 'boba', 'Claire', 'baeksu', 'endgame', 'buja', 'berzan', 'ozzy'] } },
  { username: 'ShimMoney', connections: { 4: ['builnad', 'Jinie', 'PaulC', 'whitesocks', 'baeksu'], 8: ['builnad', 'baeksu', 'mingming', 'Blaker', 'bakba', 'Jinie'] } },
  { username: 'HB', connections: { 7: ['Lavadong', 'PolyMoly', 'whitesocks', 'chamdom', 'baram7', 'Choonsik', 'Jeongnam', 'Seungjae', 'hojuun2', 'overcome', 'ssick', 'endgame', 'buja', 'Claire', 'PaulC'] } },
  { username: 'Lavadong', connections: { 7: ['HB', 'PolyMoly', 'whitesocks', 'chamdom', 'baram7', 'Choonsik', 'Jeongnam', 'Seungjae', 'hojuun2', 'overcome', 'ssick', 'endgame', 'buja', 'Claire', 'PaulC'] } },
  { username: 'PolyMoly', connections: { 7: ['HB', 'Lavadong', 'whitesocks', 'chamdom', 'baram7', 'Choonsik', 'Jeongnam', 'Seungjae', 'hojuun2', 'overcome', 'ssick', 'endgame', 'buja', 'Claire', 'PaulC'] } },
  { username: 'chamdom', connections: { 7: ['HB', 'Lavadong', 'PolyMoly', 'whitesocks', 'baram7', 'Choonsik', 'Jeongnam', 'Seungjae', 'hojuun2', 'overcome', 'ssick', 'endgame', 'buja', 'Claire', 'PaulC'] } },
  { username: 'baram7', connections: { 7: ['HB', 'Lavadong', 'PolyMoly', 'whitesocks', 'chamdom', 'Choonsik', 'Jeongnam', 'Seungjae', 'hojuun2', 'overcome', 'ssick', 'endgame', 'buja', 'Claire', 'PaulC'] } },
  { username: 'Choonsik', connections: { 7: ['HB', 'Lavadong', 'PolyMoly', 'whitesocks', 'chamdom', 'baram7', 'Jeongnam', 'Seungjae', 'hojuun2', 'overcome', 'ssick', 'endgame', 'buja', 'Claire', 'PaulC'] } },
  { username: 'Jeongnam', connections: { 7: ['HB', 'Lavadong', 'PolyMoly', 'whitesocks', 'chamdom', 'baram7', 'Choonsik', 'Seungjae', 'hojuun2', 'overcome', 'ssick', 'endgame', 'buja', 'Claire', 'PaulC'] } },
  { username: 'Seungjae', connections: { 7: ['HB', 'Lavadong', 'PolyMoly', 'whitesocks', 'chamdom', 'baram7', 'Choonsik', 'Jeongnam', 'hojuun2', 'overcome', 'ssick', 'endgame', 'buja', 'Claire', 'PaulC'] } },
  { username: 'hojuun2', connections: { 7: ['HB', 'Lavadong', 'PolyMoly', 'whitesocks', 'chamdom', 'baram7', 'Choonsik', 'Jeongnam', 'Seungjae', 'overcome', 'ssick', 'endgame', 'buja', 'Claire', 'PaulC'] } },
  { username: 'bakba', connections: { 8: ['builnad', 'baeksu', 'mingming', 'Blaker', 'ShimMoney', 'Jinie'] } },
  { username: 'Blaker', connections: { 8: ['builnad', 'baeksu', 'mingming', 'ShimMoney', 'bakba', 'Jinie'] } }
];

// 이미지 파일 경로 및 proof URL을 위한 매핑
const proofImages = {
  1: 'https://github.com/ByungHeonLEE/test2/blob/main/proof/1.png?raw=true',
  2: 'https://github.com/ByungHeonLEE/test2/blob/main/proof/2.png?raw=true',
  3: 'https://github.com/ByungHeonLEE/test2/blob/main/proof/3.png?raw=true',
  4: 'https://github.com/ByungHeonLEE/test2/blob/main/proof/4.png?raw=true',
  5: 'https://github.com/ByungHeonLEE/test2/blob/main/proof/5.png?raw=true',
  6: 'https://github.com/ByungHeonLEE/test2/blob/main/proof/6.png?raw=true',
  7: 'https://github.com/ByungHeonLEE/test2/blob/main/proof/7.png?raw=true',
  8: 'https://github.com/ByungHeonLEE/test2/blob/main/proof/8.png?raw=true',
};

// 이미지 파일을 base64로 읽어오는 함수
function getProofImageUrl(proofNumber) {
    return proofImages[proofNumber] || 'Invalid proof number';
  }
// 연결 요청을 서버로 전송하는 함수
const requestConnections = async (requesterUsername, connections, proofNumber) => {
  const proofImageBase64 = getProofImageUrl(proofNumber);

  try {
    const response = await axios.post('http://localhost:7777/api/connection/request', {
      requesterUsername,
      receiver_usernames: connections,
      proofImage: proofImageBase64,
    });

    console.log(`Connections for ${requesterUsername} successful:`, response.data);
  } catch (error) {
    console.error(`Failed to create connections for ${requesterUsername}:`, error.message);
  }
};

// 모든 유저의 연결을 처리하는 함수
const processAllConnections = async () => {
  for (const user of users) {
    for (const [proofNumber, connections] of Object.entries(user.connections)) {
      await requestConnections(user.username, connections, proofNumber);
    }
  }
};

processAllConnections();

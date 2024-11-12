import axios from 'axios';

// 유저와 연결 정보
const users = [
  { username: 'mocks', connections: { 1: ['Jinie'], 2:['baeksu'], 3:['builnad'], 4:['buja'], 5:['boba'], 6:['ozzy'] } },
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

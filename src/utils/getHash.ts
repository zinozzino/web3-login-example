import web3 from 'web3';

function getHash(value: number): string {
  return `${web3.utils.sha3(web3.utils.numberToHex(value))}`;
}

export default getHash;

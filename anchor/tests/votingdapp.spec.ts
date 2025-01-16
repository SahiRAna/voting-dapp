
import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Votingdapp } from '../target/types/votingdapp'
import IDL from '../target/idl/votingdapp.json';
import { startAnchor, BankrunProvider } from 'anchor-bankrun';

const votingAddress = new anchor.web3.PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")
describe('votingdapp', () => {
  let context;
  let provider;
  let votingProgram: anchor.Program<Votingdapp>;

  beforeAll(async () => {
    context = await startAnchor("", [{ name: "votingdapp", programId: votingAddress }], []);

    provider = new BankrunProvider(context);

    votingProgram = new Program<Votingdapp>(
      IDL as any,
      // votingAddress,
      provider,
    );
  })

  it('Initialize Poll', async () => {

    await votingProgram.methods.intializePoll(
      new anchor.BN(1),
      "what is your favorite color?",
      new anchor.BN(0),
      new anchor.BN(1836408949),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress,
    )
    const poll = await votingProgram.account.poll.fetch(pollAddress);
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("what is your favorite color?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });

});
// it("intialize candidate", async () => {
//   await votingProgram.methods.intializeCandidate(
//     |"Red",
//     new anchor.BN(1),
//   ).rpc();
// });
it("vote", async () => {

});

// echo "# voting-dapp" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/SahiRAna/voting-dapp.git
// git push -u origin main



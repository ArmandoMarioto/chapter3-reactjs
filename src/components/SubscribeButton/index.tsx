import { useSession, signIn} from "next-auth/react";
import styles from "./styles.module.scss";

type SubscribeButtonProps = {
  priceId: string;
};

export function SubscribeButton({priceId}: SubscribeButtonProps) {
  const { data: session } = useSession()

  function handleSubscribe() {
    if(!session) {
      signIn('github');
      return;
    }else{
      //criação da checkout session
      


    }
  }



  return (
    <button type="button" className={styles.subscribeButton}
    onClick={handleSubscribe}>
      Subscribe Now
    </button>
  );
}

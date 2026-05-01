interface SceneBackdropProps {
  src: string;
  tone?: 'default' | 'bright' | 'combat' | 'tournament';
}

export default function SceneBackdrop({ src, tone = 'default' }: SceneBackdropProps) {
  return (
    <div
      className={`scene-art-backdrop scene-art-backdrop-${tone}`}
      style={{ backgroundImage: `url("${src}")` }}
      aria-hidden
    />
  );
}

# Architecture rules
- Preserve the existing React routes and player columns; additive upgrades must not remove historical data.
- Save registrations through submit-registration with a stable UUID primary key so retries cannot create duplicate rows.
- Keep delivery metadata and locks in the service-only registration-internal bucket while Cloud schema migrations are unavailable; this preserves player column compatibility.
- Upload new images through upload-player-media into the service-only mpl-player-media bucket; serve time-limited signed previews and send binary media to Telegram.
- Protect all admin reads, payment decisions and Telegram retries with a server-validated ADMIN_PIN secret, never a frontend credential.
- Use the shared MplLogo component for one official branding asset across screens.

// src/data/liturgyData.js

export const DEFAULT_LITURGIES = [
  {
    id: "apostles_creed",
    title_en: "The Apostles' Creed",
    title_twi: "Asomafo No Gyedie Nsɛm",
    category: "Creed",
    rubric: "To be said by the entire Congregation standing",
    content_en: `I believe in God, the Father Almighty,
Creator of heaven and earth.

I believe in Jesus Christ, His only Son, our Lord,
who was conceived by the Holy Spirit,
born of the Virgin Mary,
suffered under Pontius Pilate,
was crucified, died, and was buried;
He descended into hell.
On the third day He rose again from the dead;
He ascended into heaven,
and is seated at the right hand of God the Father Almighty.
From there He will come to judge the living and the dead.

I believe in the Holy Spirit,
the holy Catholic Church,
the communion of saints,
the forgiveness of sins,
the resurrection of the body,
and the life everlasting. Amen.`,
    content_twi: `Megye Onyankopɔn Agya Tumfoɔ,
ɔsoro ne asase Bɔfoɔ no medi.

Me nso megye Yesu Kristo, ne Ba a ɔwoo no koro,
yɛn Awurade no medi;
ɔno na wɔnam Honhom Kronkron so nyinsɛn no,
ɔbaabun Maria woo no,
ɔhuu amane Pontio Pilato ase,
wɔbɔɔ no asɛndua mu, owui, na wosiee no;
ɔsian kɔɔ asamando.
Da a ɛtɔ so mmiɛnsa no, ɔsɔre firii awufoɔ mu;
ɔforoo kɔɔ soro,
kɔtenaa Onyankopɔn Agya Tumfoɔ no nsa nifa so.
Ɛhɔ na ɔbefiri aba abebu ateasefoɔ ne awufoɔ atɛn.

Megye Honhom Kronkron no medi,
Asɔre Kronkron no,
akronkronfoɔ nkabom no,
bɔne fafiri no,
nipadua no wusɔreɛ,
ne nkwa a enni awiei no. Amen.`,
    recommended_hymns: [1, 24, 150]
  },
  {
    id: "nicene_creed",
    title_en: "The Nicene Creed",
    title_twi: "Nikaea Gyedie Nsɛm",
    category: "Creed",
    rubric: "To be confessed at Holy Communion & Festival services",
    content_en: `We believe in one God,
the Father almighty,
maker of heaven and earth,
of all things visible and invisible.

And in one Lord Jesus Christ,
the only Son of God,
begotten from the Father before all ages,
God from God, Light from Light,
true God from true God,
begotten, not made;
of the same essence as the Father.
Through him all things were made.
For us and for our salvation
he came down from heaven;
he became incarnate by the Holy Spirit and the virgin Mary,
and was made human.
He was crucified for us under Pontius Pilate;
he suffered and was buried.
The third day he rose again, according to the Scriptures.
He ascended to heaven
and is seated at the right hand of the Father.
He will come again with glory
to judge the living and the dead.
His kingdom will never end.

And we believe in the Holy Spirit,
the Lord, the giver of life.
He proceeds from the Father and the Son,
and with the Father and the Son is worshiped and glorified.
He spoke through the prophets.
We believe in one holy catholic and apostolic church.
We affirm one baptism for the forgiveness of sins.
We look forward to the resurrection of the dead,
and to life in the world to come. Amen.`,
    content_twi: `Yɛgye Onyankopɔn koro pɛ,
Agya Otumfoɔ,
ɔsoro ne asase,
ne deɛ wɔhunu ne deɛ wɔnhunu nyinaa Yɛfoɔ no medi.

Yɛgye Awurade koro Yesu Kristo,
Onyankopɔn Ba a ɔwoo no koro,
deɛ ɔfiri Agya no mu ansa na mmerɛ nyinaa reba,
Onyankopɔn a ɔfiri Onyankopɔn mu, Hann a efiri Hann mu,
Onyankopɔn ampa a ofiri Onyankopɔn ampa mu,
ɔwoo no, na ɛnyɛ sɛ wɔbɔɔ no,
ɔne Agya no yɛ nipasu koro no medi.
Ɔnam ne so na wɔbɔɔ nnoɔma nyinaa.
Yɛn nnipa nti ne yɛn nkwagyeɛ nti
ɔsian firi soro baeɛ;
ɔnam Honhom Kronkron ne ɔbaabun Maria so bɛyɛɛ honam,
na ɔbɛyɛɛ onipa.
Wɔbɔɔ no asɛndua mu maa yɛn Pontio Pilato ase;
ɔhuu amane na wosiee no.
Da a ɛtɔ so mmiɛnsa no ɔsɔreɛ, sɛdeɛ Kyerɛwsɛm no kyerɛ no.
Ɔforoo kɔɔ soro
na ɔte Agya no nsa nifa so.
Ɔbɛsan de animuonyam aba bio
abebu ateasefoɔ ne awufoɔ atɛn.
Ne ahennie to rentwa da.

Yɛgye Honhom Kronkron,
Awurade a ɔma nkwa no medi.
Ɔno na ɔfiri Agya no ne Ɔba no mu ba,
na wɔsom no hyɛ no animuonyam sɛ Agya no ne Ɔba no.
Ɔnam adiyifoɔ no so kasaeɛ.
Yɛgye Asɔre koro a ɛyɛ kronkron, katoliko ne asomafoɔ deɛ no medi.
Yɛgye asubɔ koro bɔne fafiri ho tom.
Yɛretwɛn awufoɔ wusɔreɛ,
ne wiase a ɛreba no mu nkwa no. Amen.`,
    recommended_hymns: [2, 10, 48]
  },
  {
    id: "the_lords_prayer",
    title_en: "The Lord's Prayer",
    title_twi: "Mpaebɔ A Awurade Kyerɛe",
    category: "Prayer",
    rubric: "The Minister and People join together",
    content_en: `Our Father who art in heaven,
Hallowed be Thy name.
Thy kingdom come,
Thy will be done,
On earth as it is in heaven.
Give us this day our daily bread;
And forgive us our debts,
As we also have forgiven our debtors;
And lead us not into temptation,
But deliver us from evil.
For Thine is the kingdom,
And the power, and the glory,
Forever and ever. Amen.`,
    content_twi: `Yɛn Agya a wowɔ soro,
Wo din ho nte.
W'ahennie mmra,
W'apɛdeɛ nyɛ hɔ,
Asase so sɛdeɛ ɛyɛ wɔ soro.
Ma yɛn yɛn daadaa aduane nnɛ da yi;
Na fa yɛn aka kyɛ yɛn,
Sɛdeɛ yɛn nso yɛde kyɛ yɛn akafofoɔ no;
Na mfa yɛn nkɔ sɔhwɛ mu,
Na yi yɛn firi bɔne mu.
Na ahennie ne tumi ne animuonyam
Yɛ wo deɛ daa daa nyinaa. Amen.`,
    recommended_hymns: [56, 88]
  },
  {
    id: "holy_communion_order",
    title_en: "Order for Holy Communion (The Lord's Supper)",
    title_twi: "Awurade Adidie Kronkron Nhyiamu Nhyehyɛe",
    category: "Sacrament",
    rubric: "Conducted by an Ordained Minister",
    content_en: `I. PREPARATION & INVOCATION
Minister: Grace to you and peace from God our Father and the Lord Jesus Christ.
People: Amen.

II. CONFESSION OF SINS
Minister: Let us humbly confess our sins to Almighty God.
All: Most merciful God, we confess that we have sinned against You in thought, word, and deed, by what we have done, and by what we have left undone. We have not loved You with our whole heart; we have not loved our neighbors as ourselves. We are truly sorry and we humbly repent. For the sake of Your Son Jesus Christ, have mercy on us and forgive us; that we may delight in Your will, and walk in Your ways, to the glory of Your Name. Amen.

III. THE WORDS OF INSTITUTION
Minister: The Lord Jesus on the night when He was betrayed took bread, and when He had given thanks, He broke it, and said, "This is My body which is for you. Do this in remembrance of Me." In the same way also He took the cup, after supper, saying, "This cup is the new covenant in My blood. Do this, as often as you drink it, in remembrance of Me."

IV. DISTRIBUTION & COMMUNION HYMN
(The elements are served to the congregation while Communion hymns are sung).`,
    content_twi: `I. AHOSIESIE NE NYAME FRƐ
Ɔsɔfo: Adom ne asomdwoeɛ a ɛfiri Onyankopɔn yɛn Agya ne Awurade Yesu Kristo nka mo.
Asɔremma: Amen.

II. BƆNE HO PAEKYEW
Ɔsɔfo: Momma yɛmmrɛ yɛn ho ase mpae yɛn bɔne nkyerɛ Onyankopɔn Otumfoɔ no.
Nyinaa: Onyankopɔn mmɔborɔhunufoɔ, yɛpae mu ka sɛ yɛayɛ bɔne atia Wo wɔ adwene, asɛm, ne nneyɛeɛ mu; deɛ yɛayɛ ne deɛ anka ɛsɛ sɛ yɛyɛ a yɛanyɛ. Yɛamfa yɛn akoma nyinaa annɔ Wo; yɛannɔ yɛn yɔnko sɛ yɛn ho. Yɛn werɛ aho ampa na yɛnu yɛn ho ahobrɛaseɛ mu. Wo Ba Yesu Kristo nti, hu yɛn mmɔbɔ na fa yɛn bɔne kyɛ yɛn. Amen.

III. AHOHYƐDEƐ NO HO NSƐM
Ɔsɔfo: Awurade Yesu anadwo a wɔyii no maeɛ no, ɔfaa paanoo, na ɔdaadaa aseɛ no, ɔbubuu mu na ɔkaa sɛ: "Yei ne me nipadua a ɛwɔ hɔ ma mo; monyɛ yei nkae me." Saa ara nso na ɔfaa kuruwa no anwummere adidie no akyi, na ɔkaa sɛ: "Kuruwa yi ne apam foforɔ a ɛwɔ me mogya mu; mmerɛ biara a mobɛnom no, monyɛ yei nkae me."

IV. ADIDIE NO KYƐ NE NNASE DWOM
(Wɔkyɛ paanoo ne nsa no bere a wɔreto Awurade Adidie nnwom).`,
    recommended_hymns: [180, 181, 185, 192]
  },
  {
    id: "holy_baptism_order",
    title_en: "Order for the Sacrament of Holy Baptism",
    title_twi: "Asubɔ Kronkron Nhyehyɛe",
    category: "Sacrament",
    rubric: "For infants and adult candidates",
    content_en: `I. THE SCRIPTURAL WARRANT
Minister: Hear the words of our Lord Jesus Christ: "All authority in heaven and on earth has been given to Me. Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit."

II. THE BAPTISMAL VOWS
Minister: Do you renounce the devil and all his works, the empty display and false promises of the world?
Candidates / Parents: I do renounce them.
Minister: Do you put your whole trust in the mercy and grace of God through Jesus Christ our Lord?
Candidates / Parents: I do.

III. THE BAPTISM
(The Minister pours water upon the head of each candidate):
Minister: [Name], I baptize you in the Name of the Father, and of the Son, and of the Holy Spirit. Amen.`,
    content_twi: `I. KYERƐWSƐM MU ASƐM
Ɔsɔfo: Monte Awurade Yesu Kristo nsɛm: "Wɔde tumi nyinaa a ɛwɔ soro ne asase so ama me. Enti monkɔ nkɔyɛ aman nyinaa asuafoɔ, monbɔ wɔn asu wɔ Agya no ne Ɔba no ne Honhom Kronkron din mu."

II. ASUBƆ APAM NSƐM
Ɔsɔfo: Wopo ɔbonsam ne ne nnwuma nyinaa, ne wiase ahantan ne nnaadaa nyinaa anaa?
Wɔn a wɔrebɔ wɔn asu / Awofoɔ: Mepo wɔn.
Ɔsɔfo: Wode wo werɛ nyinaa hyɛ Onyankopɔn mmɔborɔhunu ne n'adom mu wɔ Yesu Kristo yɛn Awurade mu anaa?
Wɔn a wɔrebɔ wɔn asu / Awofoɔ: Mede hyɛ mu.

III. ASUBƆ NO AMPA
Ɔsɔfo: [Din], mebɔ wo asu wɔ Agya no, ne Ɔba no, ne Honhom Kronkron din mu. Amen.`,
    recommended_hymns: [160, 162, 165]
  },
  {
    id: "the_beatitudes",
    title_en: "The Beatitudes (Matthew 5:3-12)",
    title_twi: "Nhyira Nsɛm No (Mateo 5:3-12)",
    category: "Scripture",
    rubric: "Read responsively",
    content_en: `3 Blessed are the poor in spirit, for theirs is the kingdom of heaven.
4 Blessed are those who mourn, for they shall be comforted.
5 Blessed are the meek, for they shall inherit the earth.
6 Blessed are those who hunger and thirst for righteousness, for they shall be filled.
7 Blessed are the merciful, for they shall obtain mercy.
8 Blessed are the pure in heart, for they shall see God.
9 Blessed are the peacemakers, for they shall be called children of God.
10 Blessed are those who are persecuted for righteousness' sake, for theirs is the kingdom of heaven.`,
    content_twi: `3 Nhyira ne wɔn a wɔn honhom yɛ ahobrɛaseɛ, na wɔn na ɔsoro ahennie yɛ wɔn deɛ.
4 Nhyira ne wɔn a wɔredi awerɛhoɔ, na wɔbɛkyekye wɔn werɛ.
5 Nhyira ne wɔn a wɔn ho dwo, na asase bɛyɛ wɔn agyapadeɛ.
6 Nhyira ne wɔn a tenenee kɔm ne sukɔm de wɔn, na wɔbɛmee.
7 Nhyira ne mmɔborɔhunufoɔ, na wɔbɛhunu wɔn mmɔbɔ.
8 Nhyira ne akoma mu kronkronfoɔ, na wɔbɛhunu Onyankopɔn.
9 Nhyira ne asomdwoeɛ yɛfoɔ, na wɔbɛfrɛ wɔn Onyankopɔn mma.
10 Nhyira ne wɔn a tenenee nti wɔtan wɔn ani, na wɔn na ɔsoro ahennie yɛ wɔn deɛ.`,
    recommended_hymns: [205, 230]
  },
  {
    id: "ten_commandments",
    title_en: "The Ten Commandments (Exodus 20)",
    title_twi: "Mmmara Du No (Eksodus 20)",
    category: "Law",
    rubric: "The Law of God for the Christian Life",
    content_en: `1. You shall have no other gods before Me.
2. You shall not make for yourself a carved image or bow down to them.
3. You shall not take the name of the LORD your God in vain.
4. Remember the Sabbath day, to keep it holy.
5. Honor your father and your mother.
6. You shall not murder.
7. You shall not commit adultery.
8. You shall not steal.
9. You shall not bear false witness against your neighbor.
10. You shall not covet anything that is your neighbor's.`,
    content_twi: `1. Mma wonnya anyame foforɔ biara me nkyɛn.
2. Mmanyɛ ohoni a wɔasene mma wo ho, na mma wokoto wɔn.
3. Mma mmɔ Awurade wo Nyankopɔn din hunu.
4. Kae homeda no sɛ wobɛyɛ no kronkron.
5. Bu w'agya ne wo maame.
6. Mma nkum nipa.
7. Mma nsɛe awareɛ.
8. Mma mbɔ korɔno.
9. Mma nni wo yɔnko ho adansefo kurumu.
10. Mma nkonnya wo yɔnko adeɛ biara.`,
    recommended_hymns: [210, 215]
  },
  {
    id: "doxology",
    title_en: "Gloria Patri & The Doxology",
    title_twi: "Animuonyam Asɛm (Gloria Patri & Doxology)",
    category: "Canticle",
    rubric: "To be sung at the close of Psalms & Canticles",
    content_en: `Gloria Patri:
Glory be to the Father, and to the Son, and to the Holy Spirit;
As it was in the beginning, is now, and ever shall be,
World without end. Amen.

The Doxology:
Praise God, from whom all blessings flow;
Praise Him, all creatures here below;
Praise Him above, ye heav'nly host;
Praise Father, Son, and Holy Ghost. Amen.`,
    content_twi: `Animuonyam Asɛm:
Animuonyam nka Agya no, ne Ɔba no, ne Honhom Kronkron no;
Sɛdeɛ ɛteɛ firi ahyɛaseɛ, na ɛteɛ seesei, na ɛbɛyɛ daa,
Wiase a enni awiei. Amen.

Nkamfoɔ Nsɛm:
Monkamfo Nyame, nhyira Fibea;
Monkamfo No, asase so abɔdeɛ;
Monkamfo No, ɔsoro dɔm nyinaa;
Monkamfo Agya, Ɔba, ne Honhom. Amen.`,
    recommended_hymns: [1, 2, 500]
  }
];
